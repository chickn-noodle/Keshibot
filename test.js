(async () => {
    const patch = await fetch("https://deschtimes.com/api/v1/groups/bGVnSZkkyrXyNtUf3b8unw/shows/moto/staff?finished=true&member=444182805493186574&position=tl", {
    method: "PATCH"
})
    const data = await patch.json()
console.log(data)
})()