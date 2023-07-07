import React, {useEffect} from "react";

export const UserWeedPref = () => {
    return(
      <div>
          <p>Hi i'm the User Weed Pref creation where we create new weeds that our users enjoy</p>
          <p>You have 1 super tokens left, use them to give your favorite weed a super duper rating.</p>
          <p>if you leave the token attached for 30 days, your weed will get a popularity boost</p>
          <p>Input Weed Name</p><input type="text"/>
          <p>select weed type</p>
          <select>
              <option value="sativa">sativa</option>
              <option value="indica">indica</option>
              <option value="hybrid">hybrid</option>
              <option value="sativa-hybrid-dominant">sativa-hybrid-dominant</option>
              <option value="indica-hybrid-dominant">indica-hybrid-dominant</option>
          </select>
          <p>select weed rating 1-4</p>
          <select>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
          </select>
          <p>Super token, you only get 1 and it takes 30 days to take effect</p>
          <p>In the future lets put a date for when the token was used</p>
          <select>
              <option value="no">no</option>
              <option value="yes">yes</option>

          </select>
          <p>Input Weed description</p><textarea/>
          <button>Save</button>
      </div>
    );
}