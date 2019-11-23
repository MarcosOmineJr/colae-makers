import firestore from '@react-native-firebase/firestore';
import {  } from 'react-redux';

/**
 * @async @function fetchEventsFromFirebase
 * @param {string} mode - the mode in which the function will opperate. it can be only 'user-makers'
*/
const fetchEventsFromFirebase = async (mode)=>{
    switch(mode){
        case 'user-makers':
            let data = [];
            let snapshot = await firestore().collection('events').get();
            snapshot.docs.map((e, key)=>{
                data.push({ ...e.data(), key:key.toString() });
            });
    }
}

export default { fetchEventsFromFirebase };