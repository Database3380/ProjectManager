import Immutable from 'immutable';

import {
    ACTION_NAME
} from '../actions/app';

const initialState = Immutable.Map({
    name: 'Application'
});

const ACTION_HANDLERS = {
    [ACTION_NAME]: (state, action) => {
        let newState = state.set('prop', value);
        return newState;
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}
