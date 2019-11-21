import { addReducer } from "reactn";
import uuid from 'uuid';


addReducer('createAlert', async(global, dispatch, alert) => {
    
    const {title, description, type, id} = alert;

    if(!title || !description || !type) {
        console.error("Invalid values passed to createAlert reducer (developer fix it !)");
        return;
    }
    //TODO: create an alert spam checker, don't show message if the same is already shown !
    const finalId = id ? `${id}-${uuid.v4()}` : uuid.v4()
       
    // Automaticly remove the alert after 2 seconds, that is created
    setTimeout(() => {
        dispatch.removeAlert(finalId)
    },3000)
    return {
        alerts: [
            ...global.alerts,
            {
                id: finalId,
                type: type,
                title: title,
                description: description
            }
        ]
    }


});

addReducer('removeAlert', async(global,dispatch, id) =>
{
    return {alerts: global.alerts.filter((alert) => alert.id !== id)}
});