/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} imageUrl
 * @property {import('firebase/firestore').Timestamp | import('firebase/firestore').FieldValue} createdAt
 * @property {import('firebase/firestore').Timestamp | import('firebase/firestore').FieldValue} updateAt
 */

/**
 * @typedef {Object} Interview
 * @property {string} id
 * @property {string} position
 * @property {string} description
 * @property {number} experience
 * @property {string} userId
 * @property {string} techStack
 * @property {Array<{question: string, answer: string}>} questions
 * @property {import('firebase/firestore').Timestamp} createdAt
 * @property {import('firebase/firestore').Timestamp} updateAt
 */

/**
 * @typedef {Object} UserAnswer
 * @property {string} id
 * @property {string} mockIdRef
 * @property {string} question
 * @property {string} correct_ans
 * @property {string} user_ans
 * @property {string} feedback
 * @property {number} rating
 * @property {string} userId
 * @property {import('firebase/firestore').Timestamp} createdAt
 * @property {import('firebase/firestore').Timestamp} updateAt
 */