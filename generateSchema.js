import util from 'util';

export default (models) => {
    const allModels = {};
    console.log(util.inspect(models, false, null, true), '\n\n\n')
    Object.keys(models).forEach(model => {
        const {rawAttributes} = models[model].prototype;
         console.log(util.inspect(rawAttributes, false, null, true), '\n\n\n')
        Object.keys(rawAttributes).forEach(attr => {
            // console.log(util.inspect(attr, false, null, true), '\n\n\n')
            const name = rawAttributes[attr].Model;
            // console.log(rawAttributes[attr])
            if (!allModels[name]) {
                allModels[name] = {}
            }
            allModels[name][attr] = rawAttributes[attr].type

            // // console.log(9999, allModels )
            //
            // if(!allModels[model].fields) {
            //     allModels[model].fields = {}
            // }
            // console.log(rawAttributes[attr].Model)
            // allModels[model]['fields'][attr] = rawAttributes[attr].type
            // allModels[rawAttributes[attr].Model] = rawAttributes[attr].type
        })
    });

    // console.log(util.inspect(allModels, false, null, true), '\n\n\n')
    // console.log(999, Object.keys(allModels))

}
