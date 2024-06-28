export const BASE_URLS = {
  usEast: "https://us-east-api.stream-io-api.com/api/v1.0/",
  euWest: "https://eu-west-api.stream-io-api.com/api/v1.0/",
  singapore: "https://singapore-api.stream-io-api.com/api/v1.0/",
};

const appendApiKey = (url) => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}api_key=${process.env.REACT_APP_API_KEY}`;
};

export const getImagesUrl = (baseUrl) => appendApiKey(`${baseUrl}images`);

export const getFollowersUrl = (baseUrl, userId) =>
  appendApiKey(`${baseUrl}feed/user/${userId}/followers`);

export const getFollowingUrl = (baseUrl, userId) =>
  appendApiKey(`${baseUrl}feed/user/${userId}/follows`);

export const getUserUrl = (baseUrl, userId) => appendApiKey(`${baseUrl}user/${userId}`);

export const getUserFeedUrl = (baseUrl, userId) =>
  appendApiKey(`${baseUrl}enrich/feed/user/${userId}?withRecentReactions=true&withReactionCounts=true&withOwnReactions=true`);

export const getTimelineFeedUrl = (baseUrl, userId) =>
  appendApiKey(`${baseUrl}enrich/feed/timeline/${userId}?withRecentReactions=true&withReactionCounts=true&withOwnReactions=true`);

export const getFollowUrl = (baseUrl, userId) =>
  appendApiKey(`${baseUrl}feed/timeline/${userId}/follows`);

export const getUnfollowUrl = (baseUrl, userId, target) =>
  appendApiKey(`${baseUrl}feed/timeline/${userId}/follows/user:${target}`);

export const getReactionUrl = (baseUrl, activityId) =>
  appendApiKey(`${baseUrl}reaction/${activityId}`);
