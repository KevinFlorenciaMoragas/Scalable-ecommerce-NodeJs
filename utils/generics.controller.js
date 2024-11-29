const createItem = async (req, res, Model) => {
    try {
        const item = await Model.create(req.body)
        res.status(201).json(item)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const readAllItems = async (req, res, Model) => {
    try {
        const item = await Model.findAll()
        res.json(item)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const createItemWithImage = async (req, res, Model) => {
    try {
        const photo = req.file.filename
        console.log(photo)
        console.log(req.body)
        const itemData = {
            ...req.body,
            photo
        }
        const item = await Model.create(itemData)
        console.log(item)
        res.status(201).json(item)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const readItem = async (req, res, Model) => {
    const item = await Model.findByPk(req.params.id)
    try {
        if (item) {
            res.json(item)
        } else {
            return res.status(404).json({ error: `Item not found` })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const updateItem = async (req, res, Model) => {
    try {
        const item = await Model.findByPk(req.params.id)
        if (!item) {
            return res.status(404).json({ error: `Item not found` })
        }
        await item.update(req.body)
        res.json(item)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const deleteItem = async (req, res, Model) => {
    try {
        const item = await Model.findByPk(req.params.id)
        if (!item) {
            return res.status(404).json({ error: `${Model} not found` })
        }
        await item.destroy()
        res.json({ message: Model + "delete succesfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const changeBannerPlaceholder = async (req, res, Model) => {
    try {
        const array = await Model.findAll()
        const placeholder = "https://via.placeholder.com/800x300"
        array.forEach(element => {
            if(element.banner != placeholder){
                element.banner = placeholder
                element.save() 
            }               
        });
        return res.status(200).json({ message: "Banners changed succesfully" })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}
const changePosterPlaceholder = async (req, res, Model) => {
    try {
        const array = await Model.findAll()
        const placeholder = "https://via.placeholder.com/300x450"
        array.forEach(element => {
            if(element.poster != placeholder){
                element.poster = placeholder
                element.save() 
            }               
        });
        return res.status(200).json({ message: "Banners changed succesfully" })

    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}
const changeImagePlaceholder = async(req,res,Models) => {
    try{
        const placeholder = "https://via.placeholder.com/150"
        for (Model of Models){
            const array = await Model.findAll() 
            array.forEach(e => {
                if(e.photo != placeholder){
                    e.photo = placeholder
                    e.save()
                }
            })
        }
        res.status(200).json({message: "Photo changed succesfully"})
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    createItem,
    readAllItems,
    readItem,
    deleteItem,
    updateItem,
    createItemWithImage,
    changeBannerPlaceholder,
    changePosterPlaceholder,
    changeImagePlaceholder
}