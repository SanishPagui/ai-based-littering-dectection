"use client"

import {Spinner} from "@heroui/react";

export default function App() {
  return (<div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#FFF'
  }}>
    <div style={{
      width: '60px',
      height: '60px',
      border: '6px solid transparent',
      borderTop: '6px solid #4caf50',
      borderRight: '6px solid #81c784',
      borderBottom: '6px solid #a5d6a7',
      borderLeft: '6px solid #c8e6c9',
      borderRadius: '50%',
      animation: 'spin 1.2s linear infinite'
    }}></div>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
  )
}
