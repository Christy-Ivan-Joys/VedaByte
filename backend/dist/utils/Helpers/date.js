"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeFromDateTime = exports.formatDateTimeToIST = exports.getTime = exports.getDate = void 0;
function getDate(datestamp) {
    const date = new Date(datestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
}
exports.getDate = getDate;
function getTime(datestamp) {
    const date = new Date(datestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = hours.toString().padStart(2, '0');
    return `${strHours}:${minutes} ${ampm}`;
}
exports.getTime = getTime;
function formatDateTimeToIST(isoString) {
    const date = new Date(isoString);
    const options = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleString('en-IN', options);
}
exports.formatDateTimeToIST = formatDateTimeToIST;
function getTimeFromDateTime(isoString) {
    const date = new Date(isoString);
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleString('en-IN', options);
}
exports.getTimeFromDateTime = getTimeFromDateTime;
