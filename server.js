import express from 'express'
import http from 'http'
import socketio from 'socket.io'
import createGame from './public/scripts/game.js'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

const game = createGame()

game.subscribe(command => {
    console.log(`> Emitting ${command.type}`)
    sockets.emit(command.type, command)
})

sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`Player connected on Server with id: ${playerId}`)

    game.addPlayer( {playerId} )
    console.log(game.state)

    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({playerId})
        console.log(`Player disconnected: ${playerId}`)
    })

    socket.on('move-player', (command) => {
        command.playerId = playerId
        command.type = 'move-player'

        game.movePlayer(command)
    })

    socket.on('start-game', () =>{
        console.log("Game Started!")
        game.start()
    })

    socket.on('stop-game', () => {
        console.log("Game Stopped!")
        game.stop()
    })
})

const port = 55767

server.listen(port, () => {
    console.log(`> Server listening on port ${port}`)
})