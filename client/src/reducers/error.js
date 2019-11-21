import { addReducer } from "reactn";
import uuid from 'uuid';


addReducer('createError', async(global, dispatch, error) => {
    
    const {type, msg} = error;

    if(!msg || !type) {
        console.error("Invalid values passed to createError reducer (developer fix it !)");
        return;
    }
    //TODO: create an alert spam checker, don't show message if the same is already shown !

    const id = uuid.v4();
    // Automaticly remove the alert after 2 seconds, that is created
    setTimeout(() => {
        dispatch.removeError(id)
    },3000)
    return {
        errors: [
            ...global.errors,
            {
                id: id,
                type: type,
                msg: msg
            }
        ]
    }


});

addReducer('removeError', async(global,dispatch, id) =>
{
    return {errors: global.errors.filter((error) => error.id !== id)}
});