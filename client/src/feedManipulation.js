import React from 'react';

const FEED_ENDPOINTS = {
  'globalFeed': '/feed/global',
  'userFeed': '/feed/user',
  'profileFeed': '/feed/profile',
  'relationalFeed': '/feed/relational'
}

let mergeFeeds = (newerFeed, olderFeed) => {
    // If there is already existing data in the feed, combine them, prepending the 
    // more recent transactions to the top
    let combinedItems = (newerFeed.items || []).concat(olderFeed.items || []);

    // Update feed meta-data to accurately reflect combined data
    let combinedFeedObject = {
      items: combinedItems,
      count: (newerFeed.count || 0) + (olderFeed.count || 0),
      nextPageTransactionId: olderFeed.nextPageTransactionId || null,
      newestTransactionId: newerFeed.newestTransactionId || null
    }

    return combinedFeedObject;
};

let returnFeedEndpoint = (feedType, userId) => {
  let endpoint = FEED_ENDPOINTS[feedType];
  if (feedType === 'userFeed') {
    endpoint = `${endpoint}/${userId}`;
  }

  return endpoint;
}

module.exports = {
  mergeFeeds: mergeFeeds,
  returnFeedEndpoint: returnFeedEndpoint
}