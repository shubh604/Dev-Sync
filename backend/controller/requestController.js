const Connection = require("../model/connectionSchema");
const User = require("../model/User");
const Message = require("../model/ChatSchema")
const mongoose = require("mongoose");

// button - send connection request
async function sendRequest(req, res) {
    try {
        console.log("send request controller called");
        const fromUser = req.user.id;
        const toUser = req.params.userId;
        console.log("Sedn req backend hit");
        if (fromUser === toUser) return res.status(400).json({ success: false, message: "You cannot send request to yourself" });

        const userExists = await User.findById(toUser);
        if (!userExists) return res.status(404).json({ success: false, message: "User not found" });

        const existingConnection = await Connection.findOne({
            $or: [
                { fromUser: fromUser, toUser: toUser },
                { fromUser: toUser, toUser: fromUser }
            ]
        });

        if (existingConnection) return res.status(400).json({ success: false, message: "Request already exists" });

        const connection = await Connection.create({ fromUser, toUser, status: "pending" });

        

        return res.status(200).json({ success: true, message: "Your request has been successfully sent!" });
    } 
    catch(error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

// button - sent requests
// return array of people to whom requests has been sent
async function getsentRequest(req, res) {
    try {
        const userId = req.user.id;

        if (!userId) return res.status(404).json({ success: false, message: "no such user exists" });

        const requests = await Connection.find({ fromUser: userId, status: "pending" }).populate("toUser", "-password");

        const people = requests.map((request) => request.toUser);

        return res.status(200).json({ success: true, message: "Sent Requests have been Updated Successfully!", data: people });
    } catch(error) {
       return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

// button - pending requests
// returns an array of people who have sent requests to the curr user
async function getpendingRequest(req, res) {
    try {
        const currUserId = req.user.id;

        if (!currUserId) return res.status(404).json({ success: false, message: "no such user exists!" });

        const requests = await Connection.find({ toUser: currUserId, status: "pending" }).populate("fromUser", "-password");

        const people = requests.map((request) => request.fromUser);

        return res.status(200).json({ success: true, message: "Pending Requests have been Updated Successfully!", data: people });
    } catch(error) {
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

// pending requests mei jaake accept krna request ko
async function acceptRequest(req, res) {
    try {
        const currentUser = req.user.id;
        const fromUser = req.params.userId;

        const connection = await Connection.findOne({ fromUser, toUser: currentUser, status: "pending" });

        if (!connection) return res.status(404).json({ success: false, message: "Request not found" });

        connection.status = "accepted";
        await connection.save();

        return res.status(200).json({ success: true, message: "Request has been accepted successfully!" });
    } catch(error) {
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

// pending requests mei jaake delete krdi request
async function deleteRequest(req, res) {
    try {
        const currentUser = req.user.id;
        const fromUser = req.params.userId;

        const connection = await Connection.findOneAndDelete({ fromUser, toUser: currentUser, status: "pending" });

        if (!connection) return res.status(404).json({ success: false, message: "Request not found" });

        return res.status(200).json({ success: true, message: "Request has been deleted successfully!" });
    } catch(error) {
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

// jisne request bheji thi usne sent requests mei jaake cancel request kr diya
async function cancelRequest(req, res) {
    try {
        const currentUser = req.user.id;
        const toUser = req.params.userId;

        const connection = await Connection.findOneAndDelete({ fromUser: currentUser, toUser: toUser, status: "pending" });

        if (!connection) return res.status(404).json({ success: false, message: "Request not found" });

      
        return res.status(200).json({ success: true, message: "Request has been cancelled successfully!" });
    } catch(error) {
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

// koi connection h usse remove krna h
async function removeConnection(req, res) {
    try {
        const currentUser = req.user.id;
        const toUser = req.params.userId;

        const connection = await Connection.findOneAndDelete({
            $or: [
                { fromUser: currentUser, toUser: toUser },
                { fromUser: toUser, toUser: currentUser }
            ],
            status: "accepted"
        });

        if (!connection) return res.status(404).json({ success: false, message: "Connection not found" });

        return res.status(200).json({ success: true, message: "Connection has been removed successfully" });
    } catch(error) {
       return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}


async function getConnections(req, res) {

    try {

        const currentUser = req.user.id;

        const connections = await Connection.find({
            $or: [
                { fromUser: currentUser },
                { toUser: currentUser }
            ],
            status: "accepted"
        }).populate("fromUser toUser", "-password");

        const people = connections
            .filter(conn => conn.fromUser && conn.toUser)
            .map(conn => {

                const isCurrentUserFrom =
                    conn.fromUser._id.toString() === currentUser.toString();

                const person = isCurrentUserFrom
                    ? conn.toUser
                    : conn.fromUser;

                // received unread messages count
                const messages = isCurrentUserFrom
                    ? conn.fromMsgCount
                    : conn.toMsgCount;

                return {
                    ...person.toObject(),
                    messages
                };

            });

        return res.status(200).json({
            success: true,
            message: "Connections have been Fetched Successfully!",
            data: people
        });

    } catch(error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });

    }
}

async function getFeed(req, res) {

    try {

        const currentUser = req.user.id;

        const connections = await Connection.find({
            $or: [
                { fromUser: currentUser },
                { toUser: currentUser }
            ]
        });

        const users = await User.find({
            _id: { $ne: currentUser }
        }).select("-password");

        const connectionMap = new Map();

        connections.forEach((conn) => {

            let otherUser;
            let requestType;
            let messages = 0;

            if (conn.fromUser.toString() === currentUser.toString()) {

                otherUser = conn.toUser.toString();
                requestType = "sent";

                // unread messages received by current user
                messages = conn.fromMsgCount;

            } else {

                otherUser = conn.fromUser.toString();
                requestType = "received";

                // unread messages received by current user
                messages = conn.toMsgCount;

            }

            connectionMap.set(otherUser, {
                status: conn.status,
                requestType: requestType,
                messages
            });

        });

        const feed = users.map((user) => {

            const connectionData =
                connectionMap.get(user._id.toString());

            let status = "none";
            let requestType = null;
            let messages = 0;

            if (connectionData) {

                status = connectionData.status;
                requestType = connectionData.requestType;
                messages = connectionData.messages;

            }

            return {
                ...user.toObject(),
                connectionStatus: status,
                requestType: requestType,
                messages
            };

        });

        feed.sort(() => Math.random() - 0.5);

        return res.status(200).json({
            success: true,
            message: "feed fetched successfully",
            data: feed
        });

    } catch(error) {

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });

    }
}


module.exports = { getConnections, getFeed, getsentRequest, getpendingRequest, sendRequest, acceptRequest, deleteRequest, cancelRequest, removeConnection };