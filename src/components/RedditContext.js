import React, { useState,useEffect, createContext } from 'react';
import PropTypes from 'prop-types';

import { getPostsBySubreddit } from '../services/redditAPI';

const Context = createContext();
const { Provider, Consumer } = Context;

function RedditProvider({children}) {
  const [postsBySubreddit, changePostsBySubReddit] = useState({
    frontend: {},
    reactjs: {},
  });

  const [selectedSubreddit, changeSelectedSubreddit] = useState('reactjs');
  const [shouldRefreshSubreddit, changeShouldRefreshSubreddit] = useState(false);
  const [isFetching, changeIsFetching] = useState(false);

  function fetchPosts() {
    if (!shouldFetchPosts()) return;

    changeShouldRefreshSubreddit(false);
    changeIsFetching(true);

    getPostsBySubreddit(selectedSubreddit)
      .then(handleFetchSuccess, handleFetchError);
  }

  function shouldFetchPosts() {
    const posts = postsBySubreddit[selectedSubreddit];
    if (!posts.items) return true;
    if (isFetching) return false;
    return shouldRefreshSubreddit;
  }

  function handleFetchSuccess(json) {
    const lastUpdated = Date.now();
    const items = json.data.children.map((child) => child.data);
    const newPostsBySubreddit = {
      ...postsBySubreddit,
      [selectedSubreddit]: { items, lastUpdated },
    };

    changePostsBySubReddit(newPostsBySubreddit);
    changeShouldRefreshSubreddit(false);
    changeIsFetching(false);
  }

  function handleFetchError(error) {
    const newPostsBySubreddit = {
      ...postsBySubreddit,
      [selectedSubreddit]: {
        error: error.message,
        items: [],
      },
    };

    changePostsBySubReddit(newPostsBySubreddit);
    changeShouldRefreshSubreddit(false);
    changeIsFetching(false);
  }

  function handleSubredditChange(selectedSubreddit) {
    changeSelectedSubreddit(selectedSubreddit);
  }

  function handleRefreshSubreddit() {
    changeShouldRefreshSubreddit(true);
  }

  useEffect(() => {
    fetchPosts();
  }, [selectedSubreddit, shouldRefreshSubreddit]);
  const context = {
    postsBySubreddit,
    selectedSubreddit,
    shouldRefreshSubreddit,
    isFetching,
    selectSubreddit: changeSelectedSubreddit,
    fetchPosts,
    refreshSubreddit: handleRefreshSubreddit,
    availableSubreddits: Object.keys(postsBySubreddit),
    posts: postsBySubreddit[selectedSubreddit].items,
  };

    return (
      <Provider value={context}>
        {children}
      </Provider>
    );
}

export { RedditProvider as Provider, Consumer, Context };