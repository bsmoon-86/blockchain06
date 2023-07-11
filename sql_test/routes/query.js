const select  = `
    select 
    * 
    from 
    user_info
`

const insert = `
    insert 
    into 
    user_info 
    values 
    (?,?,?)
`

module.exports = {
    select, insert
}