const TEST = require('../../baseTest')

const createDataCorrect = {
  place_name: 'NETDB',
  place_address: '70100',
  place_contact_person: '莊先生'
}

const createDataWrong = {
  place_address: '70100',
  place_contact_person: '莊先生'
}

const updateData = {
  place_name: 'NETDB_2',
  place_address: '70102',
  place_contact_person: 'MR. Yang'
}

const Data = {createDataCorrect, createDataWrong, updateData}

const Item = {name: 'places', id: 'place_id'}

TEST(Item, Data)
