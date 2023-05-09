import { Request, Response } from "express"
import { AccountDatabase } from "../database/AccountDatabase"
import { Account } from "../models/Account"
import { AccountDB, AccountDBPost } from "../types"
import { AccountBusines } from "../business/AccountBusiness"
import { resourceLimits } from "worker_threads"

export class AccountController {
    public getAccounts = async (req: Request, res: Response) => {
        try {
            const accountBusines = new AccountBusines()
            const result = await accountBusines.getAccounts()
    
            res.status(200).send(result)
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

    public getAccountBalance = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const accountBusines = new AccountBusines()
            const result = await accountBusines.getAccountBalance(id)
            res.status(200).send({ result })
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

    public createAccount = async (req: Request, res: Response) => {
        try {
            const { id, owner_id }: AccountDBPost = req.body
            const input ={
                id,
                owner_id
            }
            const accountBusines = new AccountBusines()
            const result = await accountBusines.createAccount(input)
        
            res.status(201).send("Conta criada com sucesso")
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

    public editAccountBalance = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const value = req.body.value
    
            if (typeof value !== "number") {
                res.status(400)
                throw new Error("'value' deve ser number")
            }
    
            const accountDatabase = new AccountDatabase()
            const accountDB = await accountDatabase.findAccountById(id)
    
            if (!accountDB) {
                res.status(404)
                throw new Error("'id' não encontrado")
            }
    
            const account = new Account(
                accountDB.id,
                accountDB.balance,
                accountDB.owner_id,
                accountDB.created_at
            )
    
            const newBalance = account.getBalance() + value
            account.setBalance(newBalance)
    
            await accountDatabase.updateBalanceById(id, newBalance)
    
            res.status(200).send(account)
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
}