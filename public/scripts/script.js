import createKeyboardListener from './keyboard-listener.js'
import createGame from './game.js'
import renderScreen from './render-screen.js'

const game = createGame()

const keyboardListener = createKeyboardListener(document)

const startButton = document.querySelector('.start-button')
startButton.addEventListener('click', startGame)

const stopButton = document.querySelector('.stop-button')
stopButton.addEventListener('click', stopGame)

function startGame() {
    socket.emit('start-game')
}

function stopGame() {
    socket.emit('stop-game')
}

const socket = io()

socket.on('connect', () => {
    const playerId = socket.id
    console.log(`Player connected on Client with id: ${playerId}`)

    const screen = document.querySelector('#screen')
    renderScreen(screen, game, requestAnimationFrame, playerId)
})

socket.on('setup', (state) => {
    game.setState(state)

    const playerId = socket.id
    keyboardListener.registerPlayerId(playerId)
    keyboardListener.subscribe(game.movePlayer)
    keyboardListener.subscribe((command) => {
        socket.emit('move-player', command)
    })
})

socket.on('add-player', (command) => {
    console.log(`Receiving ${command.type} ==> ${command.playerId}`)
    game.addPlayer(command)
})

socket.on('remove-player', (command) => {
    console.log(`Receiving ${command.type} ==> ${command.playerId}`)
    game.removePlayer(command)
})

socket.on('move-player', (command) => {
    console.log(`Receiving ${command.type} ==> ${command.playerId}`)

    const playerId = socket.id

    if(playerId !== command.playerId) {
        game.movePlayer(command)
    }
})

socket.on('add-fruit', (command) => {
    console.log(`Receiving ${command.type} ==> ${command.fruitId}`)
    game.addFruit(command)
})

socket.on('remove-fruit', (command) => {
    console.log(`Receiving ${command.type} ==> ${command.fruitId}`)
    game.removeFruit(command)
})