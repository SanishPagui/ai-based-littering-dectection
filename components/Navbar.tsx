import React from 'react'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">CIDROY</h1>
          </div>
          <nav>
            <ul className="flex space-x-8">
              <li><a href="#features" className="text-gray-700 hover:text-green-600 font-medium">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-700 hover:text-green-600 font-medium">How It Works</a></li>
              <li><a href="#impact" className="text-gray-700 hover:text-green-600 font-medium">Impact</a></li>
              <li><a href="#contact" className="text-gray-700 hover:text-green-600 font-medium">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>
  )
}

export default Navbar