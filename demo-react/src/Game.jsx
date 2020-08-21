import React  from 'react'
import { IonPhaser } from '@ion-phaser/react'
import Info from './Info'


export default function Game({game, initialize}) {
    return (
        <>
            <Info />
            <IonPhaser game={game} initialize={initialize} />
        </>
    )
}
