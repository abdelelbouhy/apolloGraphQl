import React, { PureComponent } from 'react';
import { gql } from 'apollo-boost';
import { Query, graphql, Mutation} from 'react-apollo';

let counter = 1;

const getNext = () => {
    counter++;
};


const GET_USER = gql`
  query($id: Int!) {
       getUser (id: $id){
        age
        username
         Addresses {
            street
         }
      }
  }
`
const CREATE_USER = gql`
 mutation {
  addUser(User: {username:"user 700", age: 700}) {
    username
  }
}

`

class User extends PureComponent {

    getNext = () => {
        if(counter === 4) return;
        counter++;
        this.props.getUser.refetch({id: counter});
    };

    getPrev = () => {
        if(counter === 1) return;
        counter--;
        this.props.getUser.refetch({id: counter});
    };

    createUser = () => {

    }

    render() {
        console.log(this.props);

        const { getUser, onLoadMore, loading } =  this.props.getUser;

        if(loading) {
            return <div>Loading</div>
        }

        if (getUser) {
            return (
                <div>
                    <div onClick={this.getNext}>get next user</div>
                    <div onClick={this.getPrev}>get prev user</div>
                    <Mutation mutation={CREATE_USER}>
                        {(userAdd, { data }) => (

                            <div onClick={userAdd}>create new user</div>
                        )}

                    </Mutation>
                    <div>
                        <div>{getUser[0].username}</div>
                        <div>{getUser[0].age}</div>
                        <div>{getUser[0].Addresses[0].street}</div>
                        {/*<div>{user.address.street}</div>*/}
                        {/*<div>{user.address.house}</div>*/}
                        {/*<div>{user.address.road}</div>*/}
                    </div>
                </div>
            );
        }

        return <div />;
    }
}


// export default () => (
//     <Query query={GET_USER}>
//         {({ loading, error, data }) => {
//             if (loading) return <div>Loading...</div>;
//             if (error) return <div>Error :(</div>;
//
//             return (
//                 <div onClick={getNext}>get user</div>
//                 <div>
//                     <div>{data.user.username}</div>
//                     <div>{data.user.age}</div>
//                     <div>{data.user.country}</div>
//                     <div>{data.user.address.street}</div>
//                     <div>{data.user.address.house}</div>
//                     <div>{data.user.address.road}</div>
//                 </div>
//             )
//         }}
//     </Query>
// )

export default graphql(GET_USER, {
    name: 'getUser',
    options: {
        variables: {id: 1}
    }
    // props: ({ data: { fetchMore, user, loading } }) => (
    //     {
    //         onLoadMore: () => {
    //             fetchMore(GET_USER);
    //         },
    //         user,
    //         loading
    //     }
    // ),
})(User);
