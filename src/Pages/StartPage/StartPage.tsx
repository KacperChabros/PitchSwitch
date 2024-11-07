import React from 'react'
import { Link } from 'react-router-dom'
interface Props {}

const StartPage = (props: Props) => {
  return (
    <div>
            <section className="bg-green-500 text-white h-64 flex flex-col justify-center items-center">
                <h1 className="text-3xl md:text-5xl text-center font-bold mb-4">
                    Follow the latest football transfers!
                </h1>
                <p className="text-lg md:text-xl text-center mb-6">
                    Stay updated with the latest news from the world of football.
                </p>
                <Link to="/register">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Get Started
                    </button>
                </Link>
            </section>

            <section className="py-16 px-4 md:px-16 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-8 flex flex-col items-center text-center">
                    <h2 className="text-2xl md:text-4xl font-bold mb-8">
                        About PitchSwitch
                    </h2>
                    <p className="text-lg mb-4">
                        PitchSwitch provides comprehensive coverage of all the latest transfer news in the football world.
                        From confirmed transfers to rumors and player data, you'll find everything you need to stay informed.
                    </p>
                    <p className="text-lg mb-4">
                        Whether you are a fan, a journalist, or just someone who loves football, our app is designed to keep you updated
                        with reliable information and insights about your favorite clubs and players.
                    </p>
                    <ul className="list-disc list-inside text-lg">
                        <li>Transfer Insights</li>
                        <li>Players and Clubs Data</li>
                        <li>Hot Gossip about the Rumours</li>
                        <li>News From The World Of Football</li>
                        <li>Posts From Renowned Journalists</li>
                    </ul>
                </div>

                <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
                    <img
                        src="/images/transferwindow.jpg"
                        alt="La liga players"
                        className="w-full md:w-3/4 h-auto rounded-lg shadow-lg object-cover"
                    />
                </div>
            </section>
        </div>
  )
}

export default StartPage