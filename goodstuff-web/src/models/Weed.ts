

// need date created to be a part of this, and this way date can be taking into play with the app
//somehoe to drive users coming back to rate thir favorite weed if they buy it 3 times in a row
// a buy date would be helpful but should be optional

//lets not forget to include type as well which will be  a drop down  as well as store they bought it from

export interface Weed {
    id: number;
    weedname: string;
    user_id: number;
    rating :number;
    // type:string;
    // company: string;
}