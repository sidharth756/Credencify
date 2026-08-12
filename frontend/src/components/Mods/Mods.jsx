import React from 'react'
import styles from "./Mods.module.css"

function Mods() {
  return (
    <div className={styles.container}>
        <li><a href="/mod/institution">Insititution</a></li>
        <br />
        <li><a href="/mod/verify">Verify</a></li>
    </div>
  )
}

export default Mods