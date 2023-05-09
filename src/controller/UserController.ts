import { Request, Response } from "express"
import { UserDatabase } from "../database/UserDatabase"
import { User } from "../models/User"
import { UserDB } from "../types"
import { UserBusiness } from "../business/UserBusiness"
import { UserDBPost } from "../types"

export class UserController {
    public getUsers = async (req: Request, res: Response) => {
        try {

            const q = req.query.q as string

            const userBusiness = new UserBusiness()
            const result = await userBusiness.getUsers(q)
            res.status(200).send({result})
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public createUser = async (req: Request, res: Response) => {
        try {
            const { id, name, email, password }: UserDBPost = req.body
            const input= {
                id,
                name,
                email,
                password
            }
            const userBusiness = new UserBusiness()
            const result = await userBusiness.createUser(input)
    
            res.status(201).send("Usuario criado com sucesso")
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.status(400).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }
}