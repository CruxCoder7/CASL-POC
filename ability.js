import { AbilityBuilder, createMongoAbility } from '@casl/ability';


export default function defineAbilityFor(user) {
    const { can, cannot, rules } = new AbilityBuilder(createMongoAbility);

    can('read', 'Employee');
    can('read', 'Project')

    if (user.is_manager) {
        can('create', 'Project')
        can('update', 'Project', ['name', 'department']);
    }

    return createMongoAbility(rules);
}