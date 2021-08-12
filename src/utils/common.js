import { createContext } from "react";
import moment from 'moment';

export const apiBaseURL = (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '') + '/api/v1';

export const getURL = uri => {
  return `${apiBaseURL}${uri}`;
}

export const digitize = (value, places) => {
  let strVal = (value + '');
  return new Array(places - strVal.length).fill('0').join('') + strVal;
}

export const dateFormat = value => moment(value).format('DD-MM-yyyy hh:mm A');

export const dateToPickerFormat = value => moment(value).format('yyyy-MM-DDTHH:mm')

export const dateFormatWithoutTime = value => moment(value).format('yyyy-MM-DD')

export const SharedContext = createContext(null);

export const checkForMatchInArray = (array, propertyToMatch, valueToMatch) => {
  for (var i = 0; i < array.length; i++) {
    if (array[i][propertyToMatch] == valueToMatch)
      return true;
  }
  return false;
}