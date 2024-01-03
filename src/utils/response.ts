/** Error Response Function
 *
 * @param message - Error Response Message
 * @param data
 */
export const errorResponse = (message, data) => {
  return { status: 'error', message: message, ...data };
};

/** Success Response Function
 *
 * @param message -   Success Response Message
 * @param data    -   Success Response Data
 */
export const successResponse = (message, data) => {
  return { status: 'success', message: message, ...data };
};
