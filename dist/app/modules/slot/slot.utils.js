"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMinutesToTime = exports.parseTimeToMinutes = void 0;
// utils/timeUtils.ts
const parseTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};
exports.parseTimeToMinutes = parseTimeToMinutes;
const formatMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};
exports.formatMinutesToTime = formatMinutesToTime;
