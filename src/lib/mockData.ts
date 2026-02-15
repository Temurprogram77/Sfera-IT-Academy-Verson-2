export type AttendanceStatus = 'present' | 'late' | 'absent'

export interface Student {
  id: string
  name: string
  status: AttendanceStatus
  description: string
}

export interface Group {
  id: string
  name: string
  teacherName: string
  studentCount: number
  presentCount: number
  lateCount: number
  absentCount: number
  students: Student[]
}

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Frontend N23',
    teacherName: 'Abdulhakimov Shokh',
    studentCount: 25,
    presentCount: 22,
    lateCount: 2,
    absentCount: 1,
    students: [
      { id: 's1', name: 'Alisher Abdullayev', status: 'present', description: '' },
      { id: 's2', name: 'Botir Akhmedov', status: 'present', description: '' },
      { id: 's3', name: 'Dilshod Karimov', status: 'present', description: '' },
      { id: 's4', name: 'Eko Suryanto', status: 'late', description: 'Kechikti 5 daqiqa' },
      { id: 's5', name: 'Farid Uzbekov', status: 'present', description: '' },
      { id: 's6', name: 'Gafur Hamidov', status: 'present', description: '' },
      { id: 's7', name: 'Husan Mirzoev', status: 'absent', description: 'Bemalol' },
      { id: 's8', name: 'Imomjon Rakhimov', status: 'present', description: '' },
      { id: 's9', name: 'Javohir Tashmatov', status: 'present', description: '' },
      { id: 's10', name: 'Kamol Normurodov', status: 'present', description: '' },
      { id: 's11', name: 'Lola Sayfullaeva', status: 'present', description: '' },
      { id: 's12', name: 'Mirsulton Karimov', status: 'present', description: '' },
      { id: 's13', name: 'Nilufar Bahronova', status: 'present', description: '' },
      { id: 's14', name: 'Oybek Salimov', status: 'present', description: '' },
      { id: 's15', name: 'Parizod Mustafaeva', status: 'present', description: '' },
      { id: 's16', name: 'Qodirjon Hamdamov', status: 'present', description: '' },
      { id: 's17', name: 'Rasul Nasriddinov', status: 'late', description: 'Kechikti 10 daqiqa' },
      { id: 's18', name: 'Saida Abdullayeva', status: 'present', description: '' },
      { id: 's19', name: 'Tohir Ismoilov', status: 'present', description: '' },
      { id: 's20', name: 'Umida Rakhimova', status: 'present', description: '' },
      { id: 's21', name: 'Vasila Sadullayeva', status: 'present', description: '' },
      { id: 's22', name: 'Xurshed Vokhidov', status: 'present', description: '' },
      { id: 's23', name: 'Yusufjon Raxmatov', status: 'present', description: '' },
      { id: 's24', name: 'Zumrad Xamroeva', status: 'present', description: '' },
      { id: 's25', name: 'Zulfiya Nabiyeva', status: 'present', description: '' },
    ],
  },
  {
    id: '2',
    name: 'Backend N23',
    teacherName: 'Urinbaev Oleg',
    studentCount: 23,
    presentCount: 21,
    lateCount: 1,
    absentCount: 1,
    students: [
      { id: 's26', name: 'Akram Yuldashev', status: 'present', description: '' },
      { id: 's27', name: 'Behruz Sharifov', status: 'present', description: '' },
      { id: 's28', name: 'Chingiz Hamidov', status: 'present', description: '' },
      { id: 's29', name: 'Dilbar Mustafaeva', status: 'present', description: '' },
      { id: 's30', name: 'Edil Bekmuratov', status: 'present', description: '' },
      { id: 's31', name: 'Farangiz Yousupova', status: 'present', description: '' },
      { id: 's32', name: 'Gulnoza Sharipova', status: 'absent', description: 'Bemalol' },
      { id: 's33', name: 'Hamid Askarov', status: 'present', description: '' },
      { id: 's34', name: 'Ilyos Normurodov', status: 'late', description: 'Kechikti 15 daqiqa' },
      { id: 's35', name: 'Jamilya Tasheva', status: 'present', description: '' },
      { id: 's36', name: 'Kamil Razikov', status: 'present', description: '' },
      { id: 's37', name: 'Lobar Mirzaeva', status: 'present', description: '' },
      { id: 's38', name: 'Mirjalol Mirzoev', status: 'present', description: '' },
      { id: 's39', name: 'Nozim Khakimov', status: 'present', description: '' },
      { id: 's40', name: 'Odinjon Karimov', status: 'present', description: '' },
      { id: 's41', name: 'Parviz Rakhimov', status: 'present', description: '' },
      { id: 's42', name: 'Qayum Suleimanov', status: 'present', description: '' },
      { id: 's43', name: 'Ravshan Nabiyev', status: 'present', description: '' },
      { id: 's44', name: 'Samira Abdullayeva', status: 'present', description: '' },
      { id: 's45', name: 'Toshqori Normatov', status: 'present', description: '' },
      { id: 's46', name: 'Ulugbek Sadullayev', status: 'present', description: '' },
      { id: 's47', name: 'Vildan Ismoilova', status: 'present', description: '' },
      { id: 's48', name: 'Yoldosh Khakimov', status: 'present', description: '' },
    ],
  }
]
