'use client'
import React, { useMemo, useEffect, useState, useRef, ChangeEvent } from 'react';

import styles from './page.module.css'

function My_divider() {
    return (
        <div className={styles.parent_divider}>
            <div className={styles.divider}></div>
        </div>
    );
}

export default My_divider;
