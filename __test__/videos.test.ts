import request from 'supertest'
import {app, videos, VideoType} from '../src'

describe('Videos e2e tests', ()=> {

    let video_1: VideoType;

    beforeAll(async () => {
        const response = await request(app)
            .delete('/testing/all-data')
            .expect(204)
    })

    afterAll((done) => {
        done()
    })

    it('GET empty array of videos', async () => {
        const response = await request(app)
            .get('/videos')
            .expect(200);
        expect(response.body.length).toBe(0)
    })

    it('POST create new video with correct data', async () => {
        const response = await request(app)
            .post('/videos')
            .send({title: 'ford mustang', author: 'maxrehab', availableResolutions:['P144']})
            .expect(201)
        video_1 = response.body
        expect(video_1).toEqual({
            id: expect.any(Number),
            title: 'ford mustang',
            author: 'maxrehab',
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate:expect.any(String),
            availableResolutions:['P144'],
        })
    })

    it('POST does not create new video with incorrect data', async () => {
        await request(app)
            .post('/videos')
            .send({title: '', author: ''})
            .expect(400, {
                errorsMessages: [
                    {message: 'The title has incorrect values', field: 'title'},
                    {message: 'The author has incorrect values', field: 'author'}
                ]
            })
    })

    it('GET all videos', async () => {
        await request(app)
            .get('/videos')
            .expect(200)
        expect(videos)
    })

    it('GET video with correct id', async () => {
        await request(app)
            .get('/videos/' + video_1.id)
            .expect(200)
        expect(video_1)
    })

    it('GET video with incorrect id', async () => {
        await request(app)
            .get('/videos/caramba')
            .expect(404)
    })

    it('PUT video by id with correct id', async () => {

        await request(app)
            .put('/videos/' + video_1.id)
            .send({
                title: 'ford mustang',
                author: 'maxrehabbb',
                availableResolutions: ['P144'],
                canBeDownloaded: true,
                minAgeRestriction: 18,
                publicationDate: "2023-10-18T12:52:02.413Z"
            })
            .expect(204)
    })

    it('PUT video by id with incorrect id', async () => {
        await request(app)
            .put('/videos/caramba')
            .expect(404)
    })

    it('PUT video by id with correct data', async () => {
        await request(app)
            .put('/videos/' + video_1.id)
            .send({
                title: 'ford mustang',
                author: 'max rehab',
                availableResolutions: ["P144"],
                canBeDownloaded: true,
                minAgeRestriction: 18,
                publicationDate: "2023-10-18T12:52:02.413Z"
            })
            .expect(204)
    })

    it('PUT video by id with incorrect data', async () => {
        await request(app)
            .put('/videos/' + video_1.id)
            .send({
                title: '',
                author: '',
                availableResolutions: ["P200"],
                canBeDownloaded: 'caramba',
                minAgeRestriction: 21,
                publicationDate: "caramba"
            })
            .expect(400)
        expect({errorsMessages: [
            {message: 'The title has incorrect values', field: 'title'},
            {message: 'The author has incorrect values', field: 'author'},
            {message: 'The available resolution has incorrect values', field: 'Available resolution'},
            {message: 'The can be downloaded has incorrect values', field: 'Can be downloaded'},
            {message: 'The min age restriction has incorrect values', field: 'Min age restriction'},
            {message: 'The publication date has incorrect values', field: 'Publication date'}
            ]
        })
    })

    it('DELETE video by id with correct id', async () => {
        await request(app)
            .delete('/videos/' + video_1.id)
            .expect(204)
    })

    it('DELETE video by id with incorrect id', async () => {
        await request(app)
            .delete('/videos/caramba')
            .expect(404)
    })

})