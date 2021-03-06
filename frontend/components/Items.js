import React, {Component} from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag'
import styled from 'styled-components'
import Item from "./Item";
import Pagination from "./Pagination"
import {perPage} from "../config";

const ALL_ITEMS_QUERY=gql`
    query ALL_ITEMS_QUERY($skip:Int=0,$first:Int=${perPage}){
        items(first:$first,skip:$skip,orderBy:createdAt_DESC) {
            id
            title
            price
            description
            image
            largeImage
        }
    }
`;
const MyCenter =styled.div`
    text-align:center;
`;
const ItemsList=styled.div`
    display:grid;
    grid-template-columns:1fr 1fr;
    grid-gap:60px;
    max-width:${props=>props.theme.maxWidth};
`;
class Items extends Component{
    render(){
        return(
            <MyCenter>
                <Pagination pagenum={this.props.pagenum}/>
                {/*the only child of Query must be function*/}
                <Query query={ALL_ITEMS_QUERY} variables={{skip:this.props.pagenum*perPage-perPage,first:perPage}}>
                    {
                        ({data,error,loading})=>{
                            if(loading) return <p>Loading...</p>
                            if(error) return <p>Error:{error.message}</p>
                            // return <p>Found {data.items.length} items!</p>
                            return <ItemsList>
                                {
                                    data.items.map(item=><Item item={item}></Item>)
                                }
                            </ItemsList>
                        }
                    }
                </Query>
                <Pagination pagenum={this.props.pagenum}/>
            </MyCenter>
        );
    }
}
export default Items;
export {ALL_ITEMS_QUERY};