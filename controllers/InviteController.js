import Invite from "../models/Invite.js";
import Document from "../models/Document.js";

class InviteController {
    async create(req, res) {
        try {
            const {documentId, role} = req.body

            const invite = await Invite.create({documentId, role})

            return res.json(invite)
        } catch (e) {
            console.log(e)
            return res.send({message: "Server error"})
        }
    }

    async use(req, res) {
        try {
            let foundInvite = await Invite.findById(req.params.id)

            if (!foundInvite) {
                return res.status(404).send({message: "Not found"})
            }

            let foundDoc = await Document.findOne({_id: foundInvite?.documentId.toString()})
            if (!foundDoc) {
                return res.status(404).send({message: "Not found"})
            }

            foundDoc?.users?.push({
                _id: req.params.id,
                role: foundInvite.role,
                userId: req.body.userId,
                name: req.body.username
            })


            const document = await Document.findOneAndUpdate({_id: foundInvite?.documentId.toString()}, foundDoc, {
                new: true
            });

            await Invite.deleteOne({_id: req.params.id})

            return res.json(document)


        } catch (e) {
            console.log(e)
            return res.send({message: "Server error"})
        }
    }
}

export default new InviteController()