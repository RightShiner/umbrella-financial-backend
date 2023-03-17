import { User } from ".prisma/client";
import { DatabaseClient } from "../database";
import { Context } from "./Context";

export class UserClient {
    private static async handleAffiliates(userData: User) {
        if (userData.level1ReferredByUserId == null) {
            return;
        }
        if (userData.level2ReferredByUserId == null) {
            const referredByUser = await DatabaseClient.user.findUnique({
                where: {
                    id: userData.level1ReferredByUserId
                }
            });
            if (referredByUser == null) {
                return;
            }
            userData.level2ReferredByUserId = referredByUser.level1ReferredByUserId;
            userData.level3ReferredByUserId = referredByUser.level2ReferredByUserId;
        }
        if (userData.level2ReferredByUserId == null) {
            return;
        }
        if (userData.level3ReferredByUserId == null) {
            const referredByUser = await DatabaseClient.user.findUnique({
                where: {
                    id: userData.level2ReferredByUserId
                }
            });
            if (referredByUser == null) {
                return;
            }
            userData.level3ReferredByUserId = referredByUser?.level1ReferredByUserId;
        }
        return;
    }
    static async handlePostRequest(context: Context) {
        console.log(context.request);
        console.log(context.request.params);
        console.log(context.request.query);
        const userData = context.request.body;
        await this.handleAffiliates(userData);

        //validate incoming user data
        delete userData.id;

        const user = await DatabaseClient.user.create({
            data: userData,
            include: {
                level1ReferredByUser: true,
                level1ReferreUsers: true,
                level2ReferredByUser: true,
                level2ReferreUsers: true,
                level3ReferredByUser: true,
                level3ReferreUsers: true,
            }
        });
        console.log("newUser", user);
        context.response.json({
            message: "New user has been created",
            status: "success",
            user: user
        });
        context.response.end();
    }
    static async handleGetRequest(context: Context) {
        console.log("params", context.request.params);
        console.log("query", context.request.query);

        const userId = context.request.params.id;
        if (typeof userId !== "string") {
            throw new Error("user id not valid");
        }
        const user = await DatabaseClient.user.findUnique({
            where: {
                id: userId
            },
            include: {
                level1ReferredByUser: true,
                level1ReferreUsers: true,
                level2ReferredByUser: true,
                level2ReferreUsers: true,
                level3ReferredByUser: true,
                level3ReferreUsers: true,
            }
        });
        context.response.json({
            message: "New user has been created",
            status: "success",
            user: user
        });
        context.response.end();
    }
}