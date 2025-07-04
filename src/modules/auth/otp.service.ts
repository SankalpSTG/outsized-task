const generate = (length: number) => {
    if(length < 0 || length > 8) length = 6
    return `${Math.round(Math.random() * Math.pow(10, length))}`
}

export const OtpService = {
    generate
}