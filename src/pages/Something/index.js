import React from 'react'
import {  useState } from 'react'
import { signOut } from '@firebase/auth'
import { auth } from '../../firebase'

import Link from '../../components/Link'
import PasswordField from '../../components/PasswordField'
import TextField from '../../components/TextField'
import Error from '../../components/Error'

import { db } from '../../firebase'
import { writeBatch, doc, collection } from 'firebase/firestore'

const data = {
    president: [
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1nV8L4MykLUy012jn36T_v9TFA884t-oh',
            course: 'Computer Science',
            department: 'CITE',
            gender: 'Male',
            goal: 'Curabitur eu ipsum vel turpis ornare lacinia eu eget augue. Proin vitae tincidunt lectus. Nunc iaculis est enim, id posuere felis convallis tempus. Nunc eleifend nec quam a dictum. Nullam enim tellus, mattis vitae convallis sodales, sagittis quis sem. Nullam tincidunt nisi bibendum posuere scelerisque. Cras non ex arcu. Donec.',
            name: 'Vincent Griffithe P. Felicia',
            profilePic: 'https://drive.google.com/uc?export=view&id=1UXmLY161ggzc0Nu-kHuW3jpw6PSzrcBe',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=19b3bS8wXQL5KhOFQw_Fitwm-v-cDZpKV',
            course: 'Business Management',
            department: 'CBM',
            gender: 'Female',
            goal: 'Nullam in ligula vitae justo sodales vestibulum. In dignissim varius sollicitudin. Sed nisl justo, tempus in ipsum eu, euismod sollicitudin tortor. Vivamus fringilla augue dictum arcu faucibus interdum. Nunc tempor at neque ut condimentum. In gravida lectus nec suscipit venenatis. Nam scelerisque semper aliquam. Sed laoreet id felis nec faucibus.',
            name: 'Mellisa Akers',
            profilePic: 'https://drive.google.com/uc?export=view&id=1oHlFX1BvbJ0ehqacemAOsrQXvjPbyf-C',
            totalVotes: 0,
            yearLevel: 3,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1JfV0pyDpeA_Wfqu5RylHHyd_9fwYc8iH',
            course: 'Political Science',
            department: 'CAS',
            gender: 'Male',
            goal: 'Maecenas est dui, cursus quis turpis et, lobortis sodales enim. Donec vitae felis tincidunt, maximus turpis id, vehicula leo. Ut interdum ligula mi. Donec ut risus maximus, dignissim elit id, feugiat urna. Nam vel luctus ipsum. Integer tincidunt blandit risus, vel molestie erat vehicula et. Donec bibendum iaculis mauris, vitae.',
            name: 'Johnny Miller',
            profilePic: 'https://drive.google.com/uc?export=view&id=122dDuHu1H4rCxcoyV5cwwL69mqylNLim',
            totalVotes: 0,
            yearLevel: 4,
        },
    ],

    vicePresident: [
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1wOwadbMaClzehxpzq2N3SVOSOuPScEN3',
            course: 'Biology',
            department: 'CAS',
            gender: 'Female',
            goal: 'Nullam iaculis turpis at nunc facilisis, at pharetra tellus lobortis. Nulla nulla est, porttitor eget ipsum vel, hendrerit condimentum nisl. Sed eget vestibulum tellus, vitae convallis sem. Nullam ut ultricies odio, nec posuere justo. Donec at arcu sed magna interdum aliquam. Donec a metus enim. Pellentesque nisl ligula, semper a.',
            name: 'Alice Goodrich',
            profilePic: 'https://drive.google.com/uc?export=view&id=1scLrYhhqD2L8YzN_Y4050EmFzJTycu3i',
            totalVotes: 0,
            yearLevel: 3,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1nV8L4MykLUy012jn36T_v9TFA884t-oh',
            course: 'Environmental Science',
            department: 'CAS',
            gender: 'Male',
            goal: 'Maecenas ut egestas orci. Ut porta tempor neque quis scelerisque. Sed sed tempus orci, nec varius eros. Mauris quis tincidunt sem. Phasellus dolor metus, tincidunt in augue imperdiet, vulputate accumsan lacus. Curabitur pulvinar dui non auctor tristique. Vestibulum ullamcorper metus euismod euismod semper. Donec quis tempus massa. Duis sed feugiat.',
            name: 'Raymond Smith',
            profilePic: 'https://drive.google.com/uc?export=view&id=1-aKqck49HEoN5ZIENnR21mpkKfx0RFav',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=19b3bS8wXQL5KhOFQw_Fitwm-v-cDZpKV',
            course: 'Hospitality Management',
            department: 'CBM',
            gender: 'Male',
            goal: 'Maecenas non ligula ut augue euismod euismod eget vel elit. Donec vel diam vel tortor finibus feugiat. Vestibulum tristique ligula vel orci tincidunt gravida. Interdum et malesuada fames ac ante ipsum primis in faucibus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque sed maximus ipsum, eget cursus.',
            name: 'Matthew Barker',
            profilePic: 'https://drive.google.com/uc?export=view&id=1cuJO29qlu5L8D_3gxcds3yNiGizW6iF6',
            totalVotes: 0,
            yearLevel: 3,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1JfV0pyDpeA_Wfqu5RylHHyd_9fwYc8iH',
            course: 'Physical Education',
            department: 'CTE',
            gender: 'Male',
            goal: 'Nullam iaculis ex eget velit mollis malesuada. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi ut elit nulla. Aenean ut pretium turpis. Ut eget tincidunt neque. Aenean in convallis urna. Suspendisse rutrum ante fermentum nisi viverra, ut dictum odio pulvinar. Nam maximus sit amet.',
            name: 'Peter Landers',
            profilePic: 'https://drive.google.com/uc?export=view&id=1wgC7MdlUeuQ-NGNrqRii2RkkaHp7TdOh',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1wOwadbMaClzehxpzq2N3SVOSOuPScEN3',
            course: 'Environmental Science',
            department: 'CAS',
            gender: 'Female',
            goal: 'Morbi ipsum quam, fringilla vitae accumsan sed, blandit a sem. Proin non nisl tincidunt, euismod purus a, suscipit libero. Morbi bibendum vehicula quam. Aliquam non turpis iaculis, viverra dolor maximus, fringilla mi. Morbi tempor magna ut nisi consectetur congue. Sed sodales sodales facilisis. Phasellus bibendum eros et mi suscipit, at.',
            name: 'Rochelle Taylor',
            profilePic: 'https://drive.google.com/uc?export=view&id=1lhHdFpZ_OrcCXpGdaBVV71DOk5UznsG9',
            totalVotes: 0,
            yearLevel: 4,
        },
    ],

    secretary: [
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1nV8L4MykLUy012jn36T_v9TFA884t-oh',
            course: 'Environmental Science',
            department: 'CAS',
            gender: 'Male',
            goal: 'Aliquam erat volutpat. In eget sollicitudin velit. Vestibulum finibus elit blandit, viverra sem nec, laoreet metus. Curabitur malesuada augue nunc. Aenean ut magna accumsan, fringilla nulla sit amet, maximus elit. Sed condimentum dui ac ante aliquam, ac suscipit purus lobortis. Nullam pretium felis quis imperdiet posuere. Etiam rhoncus turpis ut.',
            profilePic: 'https://drive.google.com/uc?export=view&id=1-aKqck49HEoN5ZIENnR21mpkKfx0RFav',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1wOwadbMaClzehxpzq2N3SVOSOuPScEN3',
            course: 'Environmental Science',
            department: 'CAS',
            gender: 'Female',
            goal: 'Proin a egestas tellus, feugiat rhoncus velit. Duis commodo, arcu quis dignissim feugiat, sapien elit faucibus magna, nec laoreet magna ex vel leo. Etiam sagittis interdum luctus. Aliquam sit amet nulla ligula. Suspendisse dolor nunc, accumsan consequat elementum quis, elementum at nisi. Sed auctor nulla nec tellus commodo lobortis. Nulla.',
            name: 'Christine Lopez',
            profilePic: 'https://drive.google.com/uc?export=view&id=1lhHdFpZ_OrcCXpGdaBVV71DOk5UznsG9',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=19b3bS8wXQL5KhOFQw_Fitwm-v-cDZpKV',
            course: 'Hospitality Management',
            department: 'CBM',
            gender: 'Male',
            goal: 'Nulla tempus cursus neque, non scelerisque tellus malesuada vel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed est nisl. Quisque convallis tempor elementum. Vestibulum a diam egestas, cursus massa nec, condimentum enim. Pellentesque vehicula convallis eros quis scelerisque. Mauris ullamcorper ornare enim, vitae fermentum quam viverra at. In.',
            name: 'Brandon Smith',
            profilePic: 'https://drive.google.com/uc?export=view&id=1cuJO29qlu5L8D_3gxcds3yNiGizW6iF6',
            totalVotes: 0,
            yearLevel: 3,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1nV8L4MykLUy012jn36T_v9TFA884t-oh',
            course: 'Computer Science',
            department: 'CITE',
            gender: 'Male',
            goal: 'Aenean lobortis convallis velit vitae laoreet. Cras efficitur felis massa, non elementum diam facilisis vel. Maecenas sit amet dapibus lacus. Cras vel sem lectus. Praesent bibendum neque nec justo sollicitudin facilisis. Pellentesque sed euismod enim. Suspendisse porta aliquet eleifend. Suspendisse condimentum ipsum augue, non vehicula urna tempor nec. Nulla nulla.',
            name: 'Michael Collins',
            profilePic: 'https://drive.google.com/uc?export=view&id=1UXmLY161ggzc0Nu-kHuW3jpw6PSzrcBe',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=19b3bS8wXQL5KhOFQw_Fitwm-v-cDZpKV',
            course: 'Business Management',
            department: 'CBM',
            gender: 'Female',
            goal: 'Quisque finibus est eget enim accumsan molestie. Nullam laoreet diam at ante tincidunt, in dignissim arcu auctor. Pellentesque eget urna sit amet elit facilisis placerat at sit amet nunc. Morbi id nulla ut erat ultrices consectetur. Morbi sit amet tortor eu felis cursus volutpat. Sed id nisi sed magna auctor.',
            name: 'Emma Hill',
            profilePic: 'https://drive.google.com/uc?export=view&id=1oHlFX1BvbJ0ehqacemAOsrQXvjPbyf-C',
            totalVotes: 0,
            yearLevel: 3,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1JfV0pyDpeA_Wfqu5RylHHyd_9fwYc8iH',
            course: 'Political Science',
            department: 'CAS',
            gender: 'Male',
            goal: 'Nam mollis metus vitae ultrices pretium. Nam auctor aliquam risus in vehicula. Proin maximus dapibus lorem in bibendum. Cras fringilla accumsan lorem sed gravida. Ut posuere est sit amet pellentesque dignissim. Morbi sollicitudin convallis risus, et iaculis augue rhoncus et. Vestibulum eu nunc a diam laoreet lacinia. Sed sed volutpat.',
            name: 'Richard Lewis',
            profilePic: 'https://drive.google.com/uc?export=view&id=122dDuHu1H4rCxcoyV5cwwL69mqylNLim',
            totalVotes: 0,
            yearLevel: 4,
        },
    ],

    treasurer: [
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=19b3bS8wXQL5KhOFQw_Fitwm-v-cDZpKV',
            course: 'Hospitality Management',
            department: 'CBM',
            gender: 'Male',
            goal: 'Ut pellentesque vulputate nulla eget pharetra. Donec cursus lacinia venenatis. Cras porttitor nisl sed varius laoreet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam non nisi et mauris volutpat porta non sit amet metus. Proin quis ipsum consequat, vulputate nibh sed, malesuada nibh. Vivamus.',
            name: 'Kenneth Rice',
            profilePic: 'https://drive.google.com/uc?export=view&id=1cuJO29qlu5L8D_3gxcds3yNiGizW6iF6',
            totalVotes: 0,
            yearLevel: 3,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1wOwadbMaClzehxpzq2N3SVOSOuPScEN3',
            course: 'Environmental Science',
            department: 'CAS',
            gender: 'Female',
            goal: 'Sed ut leo aliquet, facilisis dui eu, semper libero. Proin eu mi nisi. Nullam blandit erat non est tempus vehicula. Duis ut nibh non nibh eleifend rhoncus sit amet ut justo. Proin sed lectus quam. Cras commodo pretium arcu nec suscipit. Nullam lacinia ac quam vitae semper. Etiam sagittis non.',
            name: 'Jane Asher',
            profilePic: 'https://drive.google.com/uc?export=view&id=1lhHdFpZ_OrcCXpGdaBVV71DOk5UznsG9',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1nV8L4MykLUy012jn36T_v9TFA884t-oh',
            course: 'Environmental Science',
            department: 'CAS',
            gender: 'Male',
            goal: 'Quisque id est ullamcorper dui ullamcorper bibendum vitae in tortor. In in mauris ac nulla mattis facilisis nec eget quam. Suspendisse fringilla ac nisl sed tincidunt. Proin interdum nisl quis ex commodo mattis. Sed et pretium augue. In sodales consequat massa quis pharetra. Morbi ante enim, blandit in mauris sit.',
            name: 'Kevin Cruz',
            profilePic: 'https://drive.google.com/uc?export=view&id=1-aKqck49HEoN5ZIENnR21mpkKfx0RFav',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1JfV0pyDpeA_Wfqu5RylHHyd_9fwYc8iH',
            course: 'Political Science',
            department: 'CAS',
            gender: 'Male',
            goal: 'Duis at purus dignissim leo lacinia mollis sed eu urna. Aliquam non faucibus sapien, non placerat sapien. Nunc iaculis, dui et pulvinar blandit, lorem sem sagittis felis, sit amet ultricies augue velit sit amet elit. Nunc vel risus in urna lacinia congue sed sit amet magna. Aenean sed augue eu.',
            name: 'Steven Irons',
            profilePic: 'https://drive.google.com/uc?export=view&id=122dDuHu1H4rCxcoyV5cwwL69mqylNLim',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1nV8L4MykLUy012jn36T_v9TFA884t-oh',
            course: 'Computer Science',
            department: 'CITE',
            gender: 'Male',
            goal: 'Cras aliquam vel est vel sagittis. In sollicitudin tortor vel libero condimentum, vitae dapibus mauris finibus. Nulla ultrices sodales ante, et aliquam dui imperdiet nec. Fusce elit elit, dictum non ullamcorper ac, convallis non est. Curabitur mollis mi at libero interdum volutpat. Nam ac euismod purus. Morbi porta sit amet.',
            name: 'Brian Rubio',
            profilePic: 'https://drive.google.com/uc?export=view&id=1UXmLY161ggzc0Nu-kHuW3jpw6PSzrcBe',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=19b3bS8wXQL5KhOFQw_Fitwm-v-cDZpKV',
            course: 'Business Management',
            department: 'CBM',
            gender: 'Female',
            goal: 'Suspendisse hendrerit orci augue. Mauris justo ipsum, sollicitudin et condimentum at, sagittis bibendum mauris. Vestibulum molestie nisl libero, a ornare ex bibendum a. Pellentesque quis eleifend leo. Morbi ornare ex ut purus molestie blandit. Morbi tempus arcu est, sit amet cursus libero porttitor quis. Interdum et malesuada fames ac ante.',
            name: 'Annie Robles',
            profilePic: 'https://drive.google.com/uc?export=view&id=1oHlFX1BvbJ0ehqacemAOsrQXvjPbyf-C',
            totalVotes: 0,
            yearLevel: 3,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1wOwadbMaClzehxpzq2N3SVOSOuPScEN3',
            course: 'Environmental Science',
            department: 'CAS',
            gender: 'Female',
            goal: 'Pellentesque varius neque sed libero bibendum, at tempor nunc fermentum. Maecenas vitae neque euismod nisl porta maximus pulvinar et elit. Vestibulum eget dui libero. Cras hendrerit augue purus, at interdum ex vehicula eget. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam malesuada lacinia est, ut volutpat arcu.',
            name: 'Katy Galvez',
            profilePic: 'https://drive.google.com/uc?export=view&id=1lhHdFpZ_OrcCXpGdaBVV71DOk5UznsG9',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1JfV0pyDpeA_Wfqu5RylHHyd_9fwYc8iH',
            course: 'Political Science',
            department: 'CAS',
            gender: 'Male',
            goal: 'Nam maximus, erat lacinia varius sagittis, odio eros viverra enim, vitae laoreet elit purus nec leo. Quisque in magna augue. Maecenas ultrices euismod eleifend. Nulla facilisi. Curabitur porta erat ac mauris porttitor finibus. Donec tincidunt felis nec dignissim consectetur. Praesent porttitor ante vel viverra semper. Ut massa orci, mollis ac.',
            name: 'Eric Dalisay',
            profilePic: 'https://drive.google.com/uc?export=view&id=122dDuHu1H4rCxcoyV5cwwL69mqylNLim',
            totalVotes: 0,
            yearLevel: 4,
        },
    ],

    auditor: [
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1nV8L4MykLUy012jn36T_v9TFA884t-oh',
            course: 'Environmental Science',
            department: 'CAS',
            gender: 'Male',
            goal: 'Maecenas interdum lacinia nisi varius ornare. Ut nec velit tellus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nunc volutpat vel nibh vitae pharetra. Nam libero turpis, finibus id urna eu, ullamcorper bibendum nisi. Aliquam ultricies nec lacus non bibendum. Nam eget lectus nulla. Fusce.',
            name: 'Kyle Natividad',
            profilePic: 'https://drive.google.com/uc?export=view&id=1-aKqck49HEoN5ZIENnR21mpkKfx0RFav',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=19b3bS8wXQL5KhOFQw_Fitwm-v-cDZpKV',
            course: 'Hospitality Management',
            department: 'CBM',
            gender: 'Male',
            goal: 'Donec placerat justo nec nulla placerat, quis commodo risus aliquet. Aenean euismod non odio nec pulvinar. Cras dui libero, tempor nec vehicula eget, laoreet vitae leo. Mauris tempor lorem mi, luctus mollis enim rutrum non. Quisque eget scelerisque ligula. Vestibulum tempus feugiat tincidunt. Integer vel libero a ex placerat semper.',
            name: 'Andres Magtibay',
            profilePic: 'https://drive.google.com/uc?export=view&id=1cuJO29qlu5L8D_3gxcds3yNiGizW6iF6',
            totalVotes: 0,
            yearLevel: 3,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1JfV0pyDpeA_Wfqu5RylHHyd_9fwYc8iH',
            course: 'Political Science',
            department: 'CAS',
            gender: 'Male',
            goal: 'Donec placerat justo nec nulla placerat, quis commodo risus aliquet. Aenean euismod non odio nec pulvinar. Cras dui libero, tempor nec vehicula eget, laoreet vitae leo. Mauris tempor lorem mi, luctus mollis enim rutrum non. Quisque eget scelerisque ligula. Vestibulum tempus feugiat tincidunt. Integer vel libero a ex placerat semper.',
            name: 'Mike Bautista',
            profilePic: 'https://drive.google.com/uc?export=view&id=122dDuHu1H4rCxcoyV5cwwL69mqylNLim',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1wOwadbMaClzehxpzq2N3SVOSOuPScEN3',
            course: 'Environmental Science',
            department: 'CAS',
            gender: 'Female',
            goal: 'Nulla et sollicitudin lorem. Proin a dui eget ante pharetra fermentum. Mauris molestie imperdiet convallis. Mauris vel sagittis velit. Praesent venenatis sit amet quam at lacinia. Nullam gravida nibh convallis nisl congue laoreet. Fusce pulvinar dapibus odio non interdum. Vestibulum volutpat auctor nisi, eu facilisis lorem scelerisque quis. In dictum.',
            name: 'Lizette Gonzales',
            profilePic: 'https://drive.google.com/uc?export=view&id=1lhHdFpZ_OrcCXpGdaBVV71DOk5UznsG9',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1nV8L4MykLUy012jn36T_v9TFA884t-oh',
            course: 'Computer Science',
            department: 'CITE',
            gender: 'Male',
            goal: 'Aliquam eget erat in justo finibus vulputate quis quis arcu. Nullam convallis massa sed pharetra ornare. Nunc ornare nec mi quis lacinia. Mauris sodales interdum odio non venenatis. Quisque ultrices auctor sem eget molestie. Nulla facilisi. Maecenas eu purus sapien. Maecenas lobortis, nibh et fringilla vestibulum, lectus lacus dictum dui.',
            name: 'Ricky Ignacio',
            profilePic: 'https://drive.google.com/uc?export=view&id=1UXmLY161ggzc0Nu-kHuW3jpw6PSzrcBe',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1wOwadbMaClzehxpzq2N3SVOSOuPScEN3',
            course: 'Environmental Science',
            department: 'CAS',
            gender: 'Female',
            goal: 'Aenean at iaculis elit. Praesent mi metus, venenatis eu sapien sed, maximus ullamcorper lorem. Aliquam orci tellus, consequat lacinia porttitor eget, tristique aliquam erat. Nullam sit amet ornare sem, et vestibulum justo. Cras eu nisl tempus, bibendum massa interdum, sodales est. Curabitur rutrum euismod est, sed varius turpis mollis venenatis.',
            name: 'Reanna Tumulak',
            profilePic: 'https://drive.google.com/uc?export=view&id=1lhHdFpZ_OrcCXpGdaBVV71DOk5UznsG9',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=19b3bS8wXQL5KhOFQw_Fitwm-v-cDZpKV',
            course: 'Business Management',
            department: 'CBM',
            gender: 'Female',
            goal: 'Cras sit amet sollicitudin mi. Morbi volutpat convallis tortor, eu finibus dolor auctor sit amet. Pellentesque eros orci, congue non urna ut, ultricies convallis lectus. Phasellus vitae erat ac enim pharetra finibus. Proin non libero ac erat efficitur semper sed vitae nisl. Duis non varius sem. Proin id lacus ac.',
            name: 'Carolyn Bayona',
            profilePic: 'https://drive.google.com/uc?export=view&id=1oHlFX1BvbJ0ehqacemAOsrQXvjPbyf-C',
            totalVotes: 0,
            yearLevel: 3,
        },
    ],

    senator: [
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1wOwadbMaClzehxpzq2N3SVOSOuPScEN3',
            course: 'Environmental Science',
            department: 'CAS',
            gender: 'Female',
            goal: 'Aenean sem arcu, ullamcorper vel orci at, dictum vulputate dui. Quisque consectetur sem quis eleifend convallis. Nunc egestas dui viverra odio porttitor, maximus accumsan est bibendum. Vestibulum vulputate, lorem quis tincidunt fringilla, ante dolor malesuada leo, eu pretium metus libero eu dui. Mauris ut ullamcorper nibh. Donec in iaculis ante.',
            name: 'Angela Mendoza',
            profilePic: 'https://drive.google.com/uc?export=view&id=1lhHdFpZ_OrcCXpGdaBVV71DOk5UznsG9',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=19b3bS8wXQL5KhOFQw_Fitwm-v-cDZpKV',
            course: 'Hospitality Management',
            department: 'CBM',
            gender: 'Male',
            goal: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec nec laoreet turpis. Nam metus odio, blandit consectetur egestas a, laoreet feugiat nulla. Duis aliquam lectus vitae ultricies imperdiet. Morbi semper fermentum mauris, ut varius libero pulvinar rhoncus. Curabitur venenatis a turpis nec molestie. Sed bibendum.',
            name: 'Jerico Pasa',
            profilePic: 'https://drive.google.com/uc?export=view&id=1cuJO29qlu5L8D_3gxcds3yNiGizW6iF6',
            totalVotes: 0,
            yearLevel: 3,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=19b3bS8wXQL5KhOFQw_Fitwm-v-cDZpKV',
            course: 'Business Management',
            department: 'CBM',
            gender: 'Female',
            goal: 'Morbi sed maximus dui. Quisque laoreet bibendum massa at luctus. Ut ac arcu augue. In nec metus est. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus nec augue viverra, consequat diam sit amet, bibendum sem. Curabitur et ipsum id libero lobortis commodo. Fusce eu.',
            name: 'Britney Hontiveros',
            profilePic: 'https://drive.google.com/uc?export=view&id=1oHlFX1BvbJ0ehqacemAOsrQXvjPbyf-C',
            totalVotes: 0,
            yearLevel: 3,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1JfV0pyDpeA_Wfqu5RylHHyd_9fwYc8iH',
            course: 'Political Science',
            department: 'CAS',
            gender: 'Male',
            goal: 'Vestibulum placerat at nunc vel blandit. Pellentesque posuere odio eget odio luctus convallis. Maecenas sed sem volutpat, lacinia ligula vitae, ullamcorper justo. Proin nibh dolor, posuere eu neque at, interdum dignissim lorem. Mauris condimentum tristique nulla, vel suscipit sem vulputate a. Sed molestie, odio sit amet consequat vehicula, libero dolor.',
            name: 'Joseph Francisco',
            profilePic: 'https://drive.google.com/uc?export=view&id=122dDuHu1H4rCxcoyV5cwwL69mqylNLim',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1nV8L4MykLUy012jn36T_v9TFA884t-oh',
            course: 'Environmental Science',
            department: 'CAS',
            gender: 'Male',
            goal: 'Maecenas at nisl odio. Integer interdum nisi nunc, eu convallis urna malesuada pulvinar. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam nec tortor velit. Cras non elementum ligula. Ut turpis dolor, lacinia vel quam eget, facilisis feugiat arcu. Aenean vitae arcu sit amet lacus.',
            name: 'Carlos Gregorio',
            profilePic: 'https://drive.google.com/uc?export=view&id=1-aKqck49HEoN5ZIENnR21mpkKfx0RFav',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1wOwadbMaClzehxpzq2N3SVOSOuPScEN3',
            course: 'Environmental Science',
            department: 'CAS',
            gender: 'Female',
            goal: 'Aliquam dictum nisi ut magna dictum dictum. Nam tincidunt dui vel luctus placerat. Donec vel tempor risus. Phasellus sit amet metus in nulla lacinia eleifend ut vel felis. Donec sodales ante non erat consequat euismod. Nam pellentesque, sem et semper aliquet, enim risus luctus eros, vel convallis eros lorem ut.',
            name: 'Cynthia Tolosa',
            profilePic: 'https://drive.google.com/uc?export=view&id=1lhHdFpZ_OrcCXpGdaBVV71DOk5UznsG9',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1nV8L4MykLUy012jn36T_v9TFA884t-oh',
            course: 'Computer Science',
            department: 'CITE',
            gender: 'Male',
            goal: 'Nullam a sapien molestie, porta sem eu, suscipit metus. Duis lorem orci, scelerisque in purus convallis, hendrerit bibendum lacus. Cras bibendum mauris sit amet nunc feugiat cursus. Pellentesque vitae diam nisi. Proin efficitur tortor quis egestas convallis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
            name: 'Arnold Domingo',
            profilePic: 'https://drive.google.com/uc?export=view&id=1UXmLY161ggzc0Nu-kHuW3jpw6PSzrcBe',
            totalVotes: 0,
            yearLevel: 4,
        },
        {
            bannerPic: 'https://drive.google.com/uc?export=view&id=1wOwadbMaClzehxpzq2N3SVOSOuPScEN3',
            course: 'Environmental Science',
            department: 'CAS',
            gender: 'Female',
            goal: 'Nullam a sapien molestie, porta sem eu, suscipit metus. Duis lorem orci, scelerisque in purus convallis, hendrerit bibendum lacus. Cras bibendum mauris sit amet nunc feugiat cursus. Pellentesque vitae diam nisi. Proin efficitur tortor quis egestas convallis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
            name: 'Katelyn Recio',
            profilePic: 'https://drive.google.com/uc?export=view&id=1lhHdFpZ_OrcCXpGdaBVV71DOk5UznsG9',
            totalVotes: 0,
            yearLevel: 4,
        },
    ]
}

function Something() {

    // const dispatch = useDispatch()
    const [showPassword, setShowPassword] = useState(false)
    const [val, setVal] = useState('')

    const batch = writeBatch(db)

    // useEffect(() => {
    //     // EFFECT
    //     getDocs(collection(db, 'users'))
    //     .then((snapshot) => {
    //         snapshot.forEach(doc => {
    //             dispatch({ type: actionTypes.SET_USER_DATA, user: doc.data() })
    //         })
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })

    //     return () => {
    //         // CLEAN UP
    //     }
    // }, [dispatch])

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const changeHandler = (e) => {
        setVal(e.target.value)
    }

    const populateCandidates = async () => {

        try {
            // data.president.forEach(data => {
            // const presidentRef = doc(collection(db, 'candidates/8RSq5CKiw5H3zJMpL9cZ/president'))
            //     batch.set(presidentRef, data);
            // })

            // data.vicePresident.forEach(data => {
            //     const viceRef = doc(collection(db, 'candidates/8RSq5CKiw5H3zJMpL9cZ/vice-president'))
            //     batch.set(viceRef, data);
            // })

            for (const key of Object.keys(data)) {
                data[key].forEach(docData => {
                    const ref = doc(collection(db, `candidates/rXaVeIj5MPiPDqMqR3h1/${key}`))
                    batch.set(ref, docData)
                })
            }

            await batch.commit()

            alert('Success populating candidates')

        } catch (err) {
            alert("An error occured in populating candidates!")
            console.log(err)
        }
    }

    return (
        <div className='p-20'>
            <PasswordField 
                show={showPassword}
                value={val}
                placeholder='Hello World'
                label='Password'
                id='something'
                onClick={toggleShowPassword}
                onChange={changeHandler} />
            <TextField id='hello' label="Hello" placeholder='Something' />
            <button onClick={() => signOut(auth)}>Sign Out</button>
            <Link classes='mt-6 inline-block text-center' underlined to='/'>
                Home Page
            </Link>
            <Link classes='mt-6 inline-block text-center' underlined to='/president'>
                President Page
            </Link>

            <button onClick={populateCandidates}>Populate Candidates</button>

            <div className='max-w-md'>
                <Error>
                    Name provided is not valid. Please follow this format, Dela Cruz, Juan A.
                </Error>
                <Error>
                    Invalid Email
                </Error>
            </div>
        </div>
    )
}

export default Something
