'use client'
import { useEffect, useState } from "react";
import { ref, get, onValue } from "firebase/database";
import Database from '../../firebase'

function RealtimeDatabaseExample() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const database = Database()
        const databaseRef = ref(database, "TSN/GPS");

        const unsubscribe = onValue(databaseRef, (snapshot) => {
            // The snapshot contains your data
            const newData = snapshot.val();
            setData(newData);
        });

        return () => {
            // Unsubscribe from the database when the component unmounts
            unsubscribe();
        };
    }, []);

    return (
        <div>
            <h1>Realtime Database Example</h1>
            {data ? (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
}

export default RealtimeDatabaseExample;
