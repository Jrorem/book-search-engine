import { gql } from '@apollo/client';

export const GET_ME = gql`
{
    me {
        _id
        savedBooks {
          bookId
          authors
                image
                description
                title
                link
        }
      }
}
`;