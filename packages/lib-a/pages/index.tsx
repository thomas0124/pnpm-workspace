import React from 'react'
import { message } from '@uttk/lib-b'

export default function Home() {
  return (
    <main style={{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif'}}>
      <div>
        <h1>Message shared from lib-b (Hono)</h1>
        <p style={{fontSize:20,marginTop:8}}>{message}</p>
      </div>
    </main>
  )
}
