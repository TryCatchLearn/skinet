export type User = {
    firstName: string;
    lastName: string;
    email: string;
    address: Address;
    roles: string | string[]
}

export type Address = {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export type LoginData = {
    email: string;
    password: string;
}

export type RegisterData = {
    firstName: string;
    lastName: string
} & LoginData