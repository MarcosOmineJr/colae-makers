const PRODUCT_LIST = [{
    id: 's02h02e02c02',
    title: 'TMA-2',
    subtitle: 'DJ PRESET',
    description: 'This configuration provides powerful low-end and boost in the mid-bass. A decrease in high frequencies lets you listen at high volume without feeling fatigue. Suitable for live performance and electronic/bass heavy music',
    price: 1400,
    bg: '#16CDC1'
}, {
    id: 's74h02e02c74',
    title: 'TMA-2',
    subtitle: 'ED BANGER EDITION',
    description: 'This combination provides a very heavy and powerful bass. Recommended for bass lovers and those who like it loud. Centered sound stage and high isolation. Limited edition of 300.',
    price: 1400,
    bg: '#BBBBBB'
}, {
    id: 's04h71e05c71',
    title: 'TMA-2',
    subtitle: 'YOUNG GURU PRESET',
    description: 'This configuration provides open, vibrant sound with good bass and treble. Wide sound stage and medium isolation.',
    price: 1850,
    bg: 'palevioletred'
}, {
    id: 's03h03e04c02',
    title: 'TMA-2',
    subtitle: 'STUDIO PRESET',
    description: 'This configuration provides a warm sound and it is good for extended listening. Great bass and added energy in the lower mid range. Wide sound stage and high isolation.',
    price: 1600,
    bg: '#629BF0'
}];

// const IMAGE_URL = `https://aiaiai.dk/images/front/${id}_m.png`;

export default (state = initialState, action)=>{

    switch(action.type){
        case 'SET_NAME':
            return {...state, name:action.payload.name};
            break;
        case 'SET_EMAIL':
            return {...state, email: action.payload.email};
            break;
    }

    return state;
};