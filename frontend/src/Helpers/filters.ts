

export function Filter(courses: any[], filterOptions: any, searchKeyWord: string) {
    let filteredCourses = [...courses]; 

    if (searchKeyWord) {
        const regex = new RegExp(searchKeyWord, 'i');
        filteredCourses = filteredCourses.filter((course: any) => regex.test(course.name) || regex.test(course.category));
    }

    if (filterOptions.category) {
        console.log(filterOptions.category,'categoriessss')
        filteredCourses = filteredCourses.filter((course: any) => course.category === filterOptions.category);
    }

    if (filterOptions.minPrice) {
        filteredCourses = filteredCourses.filter((course: any) => parseInt(course.price) >= filterOptions.minPrice);
    }

    if (filterOptions.maxPrice) {
        filteredCourses = filteredCourses.filter((course: any) => parseInt(course.price) <= filterOptions.maxPrice);
    }

    if (filterOptions.sort) {
        filteredCourses.sort((a: any, b: any) => filterOptions.sort === 'asc' ? a.price - b.price : b.price - a.price);
    }
      return filteredCourses;           
}
