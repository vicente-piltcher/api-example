import dayjs from "dayjs";

export type UserTypes = 'ADMIN' | 'USER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export type UserProps = { 
    id: string,
    name: string,
    email: string,
    username: string,
    password: string,
    type: UserTypes,
    status: UserStatus
    createdAt: Date,
    updatedAt: Date | null
}

export class User {
    private constructor(private readonly props: UserProps) {}

    public static create(name: string, email: string, username: string, password: string, type: UserTypes) {
        return new User({
            id: crypto.randomUUID().toString(),
            name,
            email,
            username,
            password,
            type,
            status: 'ACTIVE' as UserStatus,
            createdAt: dayjs().toDate(),
            updatedAt: null
        });
    }

    public static with(id: string, name: string, email: string, username: string, password: string, type: UserTypes, status: UserStatus, createdAt: Date, updatedAt: Date | null) {
        return new User({
            id,
            name,
            email,
            username,
            password,
            type,
            status,
            createdAt,
            updatedAt
        });
    }

    public get id() {
        return this.props.id
    }

    public get name() {
        return this.props.name
    }

    public get email() {
        return this.props.email
    }

    public get username() {
        return this.props.username
    }

    public get password() {
        return this.props.password
    }

    public get type() {
        return this.props.type
    }

    public get status() {
        return this.props.status
    }

    public get createdAt() {
        return this.props.createdAt
    }

    public get updatedAt() {
        return this.props.updatedAt
    }

}