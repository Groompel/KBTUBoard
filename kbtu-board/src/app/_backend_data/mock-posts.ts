import {Post} from '../_models/post';

export const POSTS: Post[] =
  [
    {
      id: 1,
      subcategory_id: 1,
      title: 'Принести кофе',
      description: 'Sint eu laboris tempor officia amet sunt irure consequat ea dolor.',
      photo: 'https://picsum.photos/200/300',
      creation_date: new Date(),
      user_id: 1
    },
    {
      id: 2,
      subcategory_id: 1,
      title: 'Принести зарядку с общаги',
      description: 'Laborum minim culpa et exercitation ea do do sit voluptate duis culpa.',
      user_id: 2,
      photo: 'https://picsum.photos/300/300',
      creation_date: new Date(2020, 3, 4, 2, 4)
    },
    {
      id: 3,
      subcategory_id: 1,
      title: 'Помогите написать сайт',
      description: 'Proident incididunt incididunt irure exercitation irure cupidatat nulla Lorem laboris culpa nulla.',
      creation_date: new Date(2019, 8, 19, 18, 28),
      user_id: 2
    },
    {
      id: 4,
      subcategory_id: 2,
      title: 'Помогу сделать уборку',
      description: 'Amet nulla aute excepteur officia dolor sint veniam incididunt magna ex aliqua.',
      creation_date: new Date(2019, 8, 19, 18, 28),
      photo: 'https://picsum.photos/200/200',
      user_id: 2
    },
    {
      id: 5,
      subcategory_id: 1,
      title: 'Нужен ноутбук на время',
      description: 'Мой сломался.',
      creation_date: new Date(2019, 8, 19, 18, 28),
      photo: 'https://picsum.photos/500/300',
      user_id: 3
    },
  ];
