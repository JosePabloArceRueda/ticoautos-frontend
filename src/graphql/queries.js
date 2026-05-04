import { gql } from '@apollo/client';

export const GET_VEHICLES = gql`
  query GetVehicles(
    $page: Int, $limit: Int,
    $brand: String, $model: String,
    $minYear: Int, $maxYear: Int,
    $minPrice: Float, $maxPrice: Float,
    $status: String, $sort: String
  ) {
    vehicles(
      page: $page, limit: $limit,
      brand: $brand, model: $model,
      minYear: $minYear, maxYear: $maxYear,
      minPrice: $minPrice, maxPrice: $maxPrice,
      status: $status, sort: $sort
    ) {
      data {
        id
        brand
        model
        year
        price
        status
        images
        owner { id name }
        createdAt
      }
      pagination { page limit total pages }
    }
  }
`;

export const GET_VEHICLE_BY_ID = gql`
  query GetVehicle($id: ID!) {
    vehicle(id: $id) {
      id
      brand
      model
      year
      price
      status
      description
      images
      owner { id name email }
      createdAt
    }
  }
`;

export const GET_MY_PROFILE = gql`
  query GetMyProfile {
    me {
      id
      name
      lastName
      email
      phone
      cedula
      birthDate
      authProvider
      status
      createdAt
    }
  }
`;

export const GET_CHATS_AS_INTERESTED = gql`
  query GetChatsAsInterested($page: Int, $limit: Int) {
    myChatsAsInterested(page: $page, limit: $limit) {
      id
      vehicle { id brand model price }
      owner { id name }
      interested { id name }
      lastMessage {
        id
        text
        sender { id name }
        createdAt
      }
      createdAt
    }
  }
`;

export const GET_CHATS_AS_OWNER = gql`
  query GetChatsAsOwner($page: Int, $limit: Int) {
    myChatsAsOwner(page: $page, limit: $limit) {
      id
      vehicle { id brand model price }
      owner { id name }
      interested { id name }
      lastMessage {
        id
        text
        sender { id name }
        createdAt
      }
      createdAt
    }
  }
`;

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($chatId: ID!, $page: Int, $limit: Int) {
    chatMessages(chatId: $chatId, page: $page, limit: $limit) {
      data {
        id
        text
        sender { id name }
        createdAt
      }
      pagination { page limit total pages }
    }
  }
`;
