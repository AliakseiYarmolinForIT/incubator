import express, {Request, Response} from 'express'

export const app = express()

app.use(express.json())

const port = process.env.PORT || 5000

export type VideoType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction:  null|number,
    createdAt: string,
    publicationDate: string,
    availableResolutions: string[]
}

export type ErrorMessageType = {
    message: string,
    field: string
}

export type ErrorsMessagesType = {errorsMessages: ErrorMessageType[]}

const errorsMessage: ErrorsMessagesType = {
    errorsMessages: []
}

export const videos: VideoType[] = []

app.get('/videos', (req: Request, res: Response<VideoType[]>) => {
    return res.status(200).send(videos)
})

app.post('/videos', (req: Request<{},{},{title: string, author: string, availableResolutions: string[]}>, res: Response) => {

    if (!req.body.title || typeof req.body.title !== 'string' || req.body.title.length > 40 || !req.body.title.trim()) {
        errorsMessage.errorsMessages.push({
            message: 'The title has incorrect values',
            field: 'title'
        })
    }

    if (!req.body.author || typeof req.body.author !== 'string' || req.body.author.length > 20 || !req.body.author.trim()) {
        errorsMessage.errorsMessages.push({
            message: 'The author has incorrect values',
            field: 'author'
        });
    }

    if (req.body.availableResolutions && req.body.availableResolutions.length) {
        const availableResolutionsArray = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
        for (let i = 0; i < req.body.availableResolutions.length; i++) {
            if (!availableResolutionsArray.includes(req.body.availableResolutions[i])) {
                errorsMessage.errorsMessages.push({
                    message: 'The available resolution has incorrect values',
                    field: 'availableResolutions'
                });
            }
        }
    }

    if (errorsMessage.errorsMessages.length) {
        res.status(400).send(errorsMessage);
        errorsMessage.errorsMessages.length = 0;
        return;
    }

    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        availableResolutions: req.body.availableResolutions ?? ['P144']
    }

    videos.push(newVideo)

    return res.status(201).send(newVideo)
})

app.get('/videos/:id', (req: Request<{id:string}>, res: Response<VideoType>) => {
    let video = videos.find(p => p.id === +req.params.id)
    if (video) {
        return res.status(200).send(video)
    }
    return res.sendStatus(404)
})

app.put('/videos/:id', (req: Request<{id:string}, {}, {title: string, author: string, availableResolutions: string[], canBeDownloaded: boolean, minAgeRestriction: number, publicationDate: string}>, res: Response) => {
    let video = videos.find(p => p.id === +req.params.id)
    if(!video) {
        return res.sendStatus(404)
    }

    if (!req.body.title || typeof req.body.title !== 'string' || req.body.title.length > 40 || !req.body.title.trim()) {
        errorsMessage.errorsMessages.push({
            message: 'The title has incorrect values',
            field: 'title'
        })
    }

    if (!req.body.author || typeof req.body.author !== 'string' || req.body.author.length > 20 || !req.body.author.trim()) {
        errorsMessage.errorsMessages.push({
            message: 'The author has incorrect values',
            field: 'author'
        });
    }

    if (req.body.availableResolutions && req.body.availableResolutions.length) {
        const availableResolutionsArray = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]
        for (let i = 0; i < req.body.availableResolutions.length; i++) {
            if (!availableResolutionsArray.includes(req.body.availableResolutions[i])) {
                errorsMessage.errorsMessages.push({
                    message: 'The available resolution has incorrect values',
                    field: 'availableResolutions'
                });
            }
        }
    }

    if (!req.body.canBeDownloaded || typeof req.body.canBeDownloaded !== 'boolean') {
        errorsMessage.errorsMessages.push({
            message: 'The can be downloaded has incorrect values',
            field: 'canBeDownloaded'
        });
    }

    if (!req.body.minAgeRestriction || req.body.minAgeRestriction < 1 || req.body.minAgeRestriction > 18 ) {
        errorsMessage.errorsMessages.push({
            message: 'The min age restriction has incorrect values',
            field: 'minAgeRestriction'
        });
    }

    if (!req.body.publicationDate ||Date.parse(req.body.publicationDate) != Date.parse(req.body.publicationDate)) {
        errorsMessage.errorsMessages.push({
            message: 'The publication date has incorrect values',
            field: 'publicationDate'
        });
    }

    if (errorsMessage.errorsMessages.length) {
        console.log('errors', errorsMessage.errorsMessages)
        res.status(400).send(errorsMessage);
        errorsMessage.errorsMessages.length = 0;
        return;
    }

    video.title = req.body.title
    video.author = req.body.author
    video.availableResolutions = req.body.availableResolutions ?? ['P144']
    video.canBeDownloaded = req.body.canBeDownloaded
    video.minAgeRestriction = req.body.minAgeRestriction
    video.publicationDate = req.body.publicationDate

    return res.sendStatus(204)
})

app.delete('/videos/:id', (req: Request<{id:string}>, res: Response) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i,1)
            return res.sendStatus(204)
        }
    }
    return res.sendStatus(404)
})

app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos.length = 0
    return res.sendStatus(204)
})

app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
})