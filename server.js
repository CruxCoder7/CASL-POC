import defineAbilityFor from './ability.js';
import { permittedFieldsOf } from '@casl/ability/extra';
import data from './data.json' assert { type: "json" };
import express from 'express'

const user = {
    id: 1,
    name: "Peter",
    project: 2,
    is_manager: true
}

// const user = {
//     id: 1,
//     name: "John Doe",
//     department: "IT",
//     salary: 50000
// }

const user_ability = defineAbilityFor(user);

const PROJECT_FIELDS = ['id', 'name', 'department'];
const options = { fieldsFrom: rule => rule.fields || PROJECT_FIELDS };


const app = express()

app.get('/getemp', (req, res) => {
    if (user_ability.can('read', 'Employee')) {
        // can use the select(-salary) method while using CASL with mongoose.
        const employeesWithoutSalary = data.employees.map(employee => {
            const { salary, ...employeeWithoutSalary } = employee;
            return employeeWithoutSalary;
        });
        res.json({ data: employeesWithoutSalary })
    } else {
        res.json({ message: 'No Permission' })
    }
})

app.get('/createmanager', (req, res) => {
    if (user_ability.can('create', 'Project')) {
        const Project = {
            id: 4,
            name: 'Project D',
            department: 'HR'
        }
        data.projects.push(Project);
        res.json({ data: data.projects })
    } else {
        res.json({ message: 'No Permission' })
    }
})

app.get("/updateproject", (req, res) => {
    if (user_ability.can('update', 'Project')) {
        let fields = permittedFieldsOf(user_ability, 'update', 'Project', options);
        res.json({ updatable_fields: fields })
    } else {
        res.json({ updatable_fields: [] })
    }
})




app.listen(3000, () => {
    console.log('started...');
})