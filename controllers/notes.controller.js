// const asyncHandler = require("express-async-handler")
const {Op} = require("sequelize")


module.exports = (sequelize, io, connectedUsers) => {
const {NoteType, User, Note} = require("../database/models")(sequelize)

const getLastNotesStats = async() => {
    try {
        connectedUsers.map(async(user, index) => {
            const existedUser = await User.findOne({ where:{ id: parseInt(user.user_id)}})
            if(existedUser.daily_notifications) {
                const notes = await Note.findAll({where:{
                    UserId: user.user_id,
                    is_deleted: false
                }})
                io.to(connectedUsers[index].socketId).emit(`Daily_Notes`,notes)
                
            }

        })
    } catch (error) {
        next(new Error(error))
    }
}

/**
 * get Notes  For Specific User
 */
const getUserNotes = async(req, res, next) => {
    const {user_id} = req.params
    if(!user_id) {
        return next(new Error("Please Fill All Data"))
    }
    try {
        const user = await User.findOne({ where:{ id: parseInt(user_id)}})
        if (user) {
            const notes = await Note.findAll({
                where:{
                    UserId: parseInt(user_id),
                    is_deleted: false
                }
            })
            const index = connectedUsers.findIndex(row => parseInt(row.user_id) === parseInt(user_id))
            if(index != -1) {
                io.to(connectedUsers[index].socketId).emit(`Create_Note`,
                 `Note of type  has been created for user}`)
    
            }
            return res.send(notes)
        }
        next(new Error("Invalid user"))
    } catch (error) {
        next(new Error(error))
    }
}    
/**
 * Send Note To One Or Multiple User
 */
const sendNote = async(req, res, next) => {
    const {note_name, note_message, type_id, users} = req.body

    if(!note_name || !note_message || !type_id || !users) {
        return next(new Error("Please Fill All Data"))
    }

    try {
        if (users.length > 1) { // if multiple user
            users.forEach(async(user_id) => {
                const user = await User.findOne({ where:{ id: parseInt(user_id)}})
                const type = await NoteType.findOne({ where:{ id: parseInt(type_id)}})
                if (user && type) {
                    const note = await Note.create({
                        title: note_name,
                        message: note_message,
                        NoteTypeId: parseInt(type_id),
                        UserId: user.id,
                        files: req.resultString ? req.resultString : ""
                    })
    
                    if (note) {
                        const index = connectedUsers.findIndex(row => parseInt(row.user_id) === parseInt(user.id))
                        if(index != -1) {
                            // send notification for the online user
                            io.to(connectedUsers[index].socketId).emit(`Create_Note`,
                             `Note of type ${type.name} has been created for user ${user.name}`)

                        }
                    }
                }
            });
        } else { // if single user
                const user = await User.findOne({ where:{ id: parseInt(users[0])}})
                const type = await NoteType.findOne({ where:{ id: parseInt(type_id)}})
                if (user && type) {
                    const note = await Note.create({
                        title: note_name,
                        message: note_message,
                        NoteTypeId: parseInt(type_id),
                        UserId: user.id,
                        files: req.resultString ? req.resultString : ""
                    })
                    if (note) {
                        const index = connectedUsers.findIndex(row => parseInt(row.user_id) === parseInt(user.id))
                        if(index != -1) {
                            // send notification for the online user
                            io.to(connectedUsers[index].socketId).emit(`Create_Note`,
                             `Note of type ${type.name} has been created for user ${user.name}`)

                        }
                    }
            }
        }
    
        res.send({message: "Done"})  
    } catch (error) {
        next(new Error(error))
    }


}

/**
 * Delete One Or More Notes For Specific User
 */
const DeleteNote = async(req, res, next)  => {
    const {user_id, notes} = req.query
    if (!user_id || !notes) {
        return next(new Error("Please Fill All Data"))
    }
    try {
        await Note.update({
            is_deleted: true
        }, {
            where:{
                UserId: user_id,
                id: notes // in array
            }
        })
    
        res.send({message: "Done"})
    } catch (error) {
        next(new Error(error))
    }


}

/**
 * Get Last Month Timeline Of Notes For Specific User
 */
const NotesLastMonth = async(req, res, next) => {

    var { page, size, types, user_id } = req.query;
    if (!user_id) {
       return next(new Error("No User Given"))
   }
    var condition = types ? {
        id : types, // in types
        disable: false
       } : {disable: false};

    types = await NoteType.findAll({
        where: condition
    })
    var enabledTypes = []

    types.forEach(type => {
        enabledTypes.push(type.id)
    });

    var lastMonth = new Date()
    lastMonth.setDate(lastMonth.getDate() - 31);

    condition =  {
         NoteTypeId: enabledTypes,
         createdAt: {
            [Op.lt]: new Date(),
            [Op.gt]: lastMonth
          },
          UserId: user_id 
        } 

    const { limit, offset } = getPagination(page, size);
    
    try {
        const data = await Note.findAndCountAll({
            where: condition,
            limit,
            offset
        })
        const response = getPagingData(data, page, limit)
        res.send(response)
   
    } catch (error) {
        next(new Error(error))
    }


}


const getPagination = (page, size) => {
    const limit = size ? size : 3;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
};
  
const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: notes } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, notes, totalPages, currentPage };
};
return {sendNote, NotesLastMonth, DeleteNote, getUserNotes, getLastNotesStats}
}