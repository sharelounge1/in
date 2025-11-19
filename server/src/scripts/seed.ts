import { supabaseAdmin } from '../config/supabase';
import { hashPassword } from '../utils/crypto';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // 1. Create test users
    console.log('Creating users...');
    const hashedPassword = await hashPassword('Test1234!');

    // Admin user
    const { data: adminUser } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: '00000000-0000-0000-0000-000000000001',
        email: 'admin@test.com',
        password_hash: hashedPassword,
        name: '관리자',
        nickname: 'admin',
        phone: '010-0000-0000',
        role: 'admin',
        status: 'active',
        email_verified: true,
      })
      .select()
      .single();

    // Influencer users
    const influencers = [
      {
        id: '00000000-0000-0000-0000-000000000010',
        email: 'influencer1@test.com',
        name: '김여행',
        nickname: 'travel_kim',
        phone: '010-1111-1111',
        instagram_url: 'https://instagram.com/travel_kim',
        follower_count: 50000,
        introduction: '여행을 사랑하는 인플루언서입니다. 특별한 경험을 함께 나누고 싶어요!',
      },
      {
        id: '00000000-0000-0000-0000-000000000011',
        email: 'influencer2@test.com',
        name: '이파티',
        nickname: 'party_lee',
        phone: '010-2222-2222',
        instagram_url: 'https://instagram.com/party_lee',
        follower_count: 80000,
        introduction: '파티와 이벤트 전문 인플루언서! 즐거운 시간을 만들어드려요.',
      },
    ];

    for (const inf of influencers) {
      await supabaseAdmin.from('profiles').upsert({
        id: inf.id,
        email: inf.email,
        password_hash: hashedPassword,
        name: inf.name,
        nickname: inf.nickname,
        phone: inf.phone,
        role: 'influencer',
        status: 'active',
        email_verified: true,
      });

      await supabaseAdmin.from('influencer_profiles').upsert({
        user_id: inf.id,
        instagram_url: inf.instagram_url,
        follower_count: inf.follower_count,
        introduction: inf.introduction,
        status: 'approved',
        bank_name: '신한은행',
        account_number: '110-123-456789',
        account_holder: inf.name,
      });
    }

    // Regular users
    const users = [
      {
        id: '00000000-0000-0000-0000-000000000100',
        email: 'user1@test.com',
        name: '박참여',
        nickname: 'user_park',
        phone: '010-3333-3333',
      },
      {
        id: '00000000-0000-0000-0000-000000000101',
        email: 'user2@test.com',
        name: '최팬',
        nickname: 'user_choi',
        phone: '010-4444-4444',
      },
      {
        id: '00000000-0000-0000-0000-000000000102',
        email: 'user3@test.com',
        name: '정여행',
        nickname: 'user_jung',
        phone: '010-5555-5555',
      },
    ];

    for (const user of users) {
      await supabaseAdmin.from('profiles').upsert({
        id: user.id,
        email: user.email,
        password_hash: hashedPassword,
        name: user.name,
        nickname: user.nickname,
        phone: user.phone,
        role: 'user',
        status: 'active',
        email_verified: true,
      });
    }

    console.log('✅ Users created');

    // 2. Create courses
    console.log('Creating courses...');
    const courses = [
      {
        id: '00000000-0000-0000-0000-000000001001',
        influencer_id: influencers[0].id,
        title: '제주도 힐링 여행 3박 4일',
        description: '제주도의 아름다운 자연 속에서 힐링하는 특별한 여행입니다. 오름 트레킹, 카페 투어, 맛집 탐방 등 다양한 프로그램이 준비되어 있어요.',
        country: '대한민국',
        city: '제주',
        start_date: '2025-02-01',
        end_date: '2025-02-04',
        price: 890000,
        max_participants: 15,
        min_participants: 5,
        status: 'recruiting',
        recruitment_start: '2025-01-01',
        recruitment_end: '2025-01-25',
        min_age: 20,
        max_age: 45,
        gender_restriction: 'all',
        includes: ['숙박 3박', '조식 3회', '입장료', '가이드'],
        excludes: ['항공권', '개인 경비', '여행자 보험'],
      },
      {
        id: '00000000-0000-0000-0000-000000001002',
        influencer_id: influencers[0].id,
        title: '도쿄 맛집 탐방 2박 3일',
        description: '도쿄의 숨은 맛집들을 찾아다니는 미식 여행! 라멘, 스시, 야키토리 등 일본 현지 맛집을 함께 탐방해요.',
        country: '일본',
        city: '도쿄',
        start_date: '2025-03-15',
        end_date: '2025-03-17',
        price: 1200000,
        max_participants: 10,
        min_participants: 4,
        status: 'recruiting',
        recruitment_start: '2025-01-15',
        recruitment_end: '2025-03-01',
        min_age: 25,
        max_age: 50,
        gender_restriction: 'all',
        includes: ['숙박 2박', '가이드', '식사 5회'],
        excludes: ['항공권', '개인 경비'],
      },
      {
        id: '00000000-0000-0000-0000-000000001003',
        influencer_id: influencers[1].id,
        title: '방콕 파티 투어 4박 5일',
        description: '방콕 최고의 클럽과 루프탑 바를 경험하는 파티 투어! VIP 테이블과 특별한 파티 경험을 제공합니다.',
        country: '태국',
        city: '방콕',
        start_date: '2025-04-10',
        end_date: '2025-04-14',
        price: 1500000,
        max_participants: 20,
        min_participants: 8,
        status: 'recruiting',
        recruitment_start: '2025-02-01',
        recruitment_end: '2025-03-31',
        min_age: 21,
        max_age: 40,
        gender_restriction: 'all',
        includes: ['숙박 4박', 'VIP 클럽 입장', '파티 참가비', '공항 픽업'],
        excludes: ['항공권', '식사', '개인 음료'],
      },
    ];

    for (const course of courses) {
      await supabaseAdmin.from('courses').upsert(course);

      // Create course schedules
      const schedules = [];
      const startDate = new Date(course.start_date);
      const endDate = new Date(course.end_date);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        schedules.push({
          course_id: course.id,
          day_number: i + 1,
          date: date.toISOString().split('T')[0],
          title: `Day ${i + 1}`,
          description: `${i + 1}일차 일정입니다.`,
        });
      }

      await supabaseAdmin.from('course_schedules').upsert(schedules);

      // Create course options
      const options = [
        {
          course_id: course.id,
          name: '싱글룸 업그레이드',
          description: '1인실로 업그레이드',
          price: 150000,
          max_quantity: 5,
        },
        {
          course_id: course.id,
          name: '공항 픽업',
          description: '공항에서 숙소까지 픽업 서비스',
          price: 50000,
          max_quantity: 15,
        },
      ];

      await supabaseAdmin.from('course_options').upsert(options);
    }

    console.log('✅ Courses created');

    // 3. Create parties
    console.log('Creating parties...');
    const parties = [
      {
        id: '00000000-0000-0000-0000-000000002001',
        influencer_id: influencers[1].id,
        title: '강남 루프탑 파티',
        description: '강남 최고의 루프탑에서 펼쳐지는 특별한 파티! DJ 공연과 함께 즐기는 시원한 밤.',
        region: '서울',
        venue: '강남 XX 루프탑',
        date: '2025-01-25',
        start_time: '19:00',
        end_time: '23:00',
        price: 80000,
        max_participants: 50,
        min_participants: 20,
        status: 'recruiting',
        recruitment_start: '2025-01-01',
        recruitment_end: '2025-01-20',
        min_age: 20,
        max_age: 40,
        gender_restriction: 'all',
        includes: ['웰컴 드링크 1잔', '핑거푸드', 'DJ 공연'],
      },
      {
        id: '00000000-0000-0000-0000-000000002002',
        influencer_id: influencers[1].id,
        title: '홍대 인디밴드 콘서트 파티',
        description: '홍대 인디밴드들의 라이브 공연과 함께하는 특별한 밤!',
        region: '서울',
        venue: '홍대 YY 라이브홀',
        date: '2025-02-14',
        start_time: '18:00',
        end_time: '22:00',
        price: 60000,
        max_participants: 100,
        min_participants: 30,
        status: 'recruiting',
        recruitment_start: '2025-01-15',
        recruitment_end: '2025-02-10',
        min_age: 18,
        max_age: 45,
        gender_restriction: 'all',
        includes: ['공연 관람', '굿즈 1개'],
      },
    ];

    for (const party of parties) {
      await supabaseAdmin.from('parties').upsert(party);
    }

    console.log('✅ Parties created');

    // 4. Create applications
    console.log('Creating applications...');
    const applications = [
      {
        id: '00000000-0000-0000-0000-000000003001',
        course_id: courses[0].id,
        user_id: users[0].id,
        status: 'confirmed',
        participant_name: users[0].name,
        participant_phone: users[0].phone,
        participant_email: users[0].email,
        total_amount: 890000,
        paid_amount: 890000,
      },
      {
        id: '00000000-0000-0000-0000-000000003002',
        course_id: courses[0].id,
        user_id: users[1].id,
        status: 'pending',
        participant_name: users[1].name,
        participant_phone: users[1].phone,
        participant_email: users[1].email,
        total_amount: 1040000, // With options
        paid_amount: 0,
      },
      {
        id: '00000000-0000-0000-0000-000000003003',
        course_id: courses[1].id,
        user_id: users[2].id,
        status: 'confirmed',
        participant_name: users[2].name,
        participant_phone: users[2].phone,
        participant_email: users[2].email,
        total_amount: 1200000,
        paid_amount: 1200000,
      },
    ];

    for (const app of applications) {
      await supabaseAdmin.from('course_applications').upsert(app);
    }

    // Party applications
    const partyApplications = [
      {
        id: '00000000-0000-0000-0000-000000004001',
        party_id: parties[0].id,
        user_id: users[0].id,
        status: 'confirmed',
        participant_name: users[0].name,
        participant_phone: users[0].phone,
        total_amount: 80000,
        paid_amount: 80000,
      },
      {
        id: '00000000-0000-0000-0000-000000004002',
        party_id: parties[0].id,
        user_id: users[1].id,
        status: 'pending',
        participant_name: users[1].name,
        participant_phone: users[1].phone,
        total_amount: 80000,
        paid_amount: 0,
      },
    ];

    for (const app of partyApplications) {
      await supabaseAdmin.from('party_applications').upsert(app);
    }

    console.log('✅ Applications created');

    // 5. Create payments
    console.log('Creating payments...');
    const payments = [
      {
        id: '00000000-0000-0000-0000-000000005001',
        user_id: users[0].id,
        application_id: applications[0].id,
        application_type: 'course',
        amount: 890000,
        status: 'completed',
        payment_method: 'card',
        merchant_uid: 'PAY_20250101_001',
        imp_uid: 'imp_test_001',
        paid_at: new Date().toISOString(),
      },
      {
        id: '00000000-0000-0000-0000-000000005002',
        user_id: users[2].id,
        application_id: applications[2].id,
        application_type: 'course',
        amount: 1200000,
        status: 'completed',
        payment_method: 'naverpay',
        merchant_uid: 'PAY_20250102_001',
        imp_uid: 'imp_test_002',
        paid_at: new Date().toISOString(),
      },
      {
        id: '00000000-0000-0000-0000-000000005003',
        user_id: users[0].id,
        application_id: partyApplications[0].id,
        application_type: 'party',
        amount: 80000,
        status: 'completed',
        payment_method: 'card',
        merchant_uid: 'PAY_20250103_001',
        imp_uid: 'imp_test_003',
        paid_at: new Date().toISOString(),
      },
    ];

    for (const payment of payments) {
      await supabaseAdmin.from('payments').upsert(payment);
    }

    console.log('✅ Payments created');

    // 6. Create announcements
    console.log('Creating announcements...');
    const announcements = [
      {
        course_id: courses[0].id,
        title: '준비물 안내',
        content: '여행 준비물을 안내드립니다.\n\n1. 편한 운동화\n2. 따뜻한 겉옷\n3. 개인 세면도구\n4. 카메라\n\n궁금한 점은 문의 주세요!',
        is_important: true,
      },
      {
        course_id: courses[0].id,
        title: '집합 장소 안내',
        content: '2월 1일 오전 9시, 제주공항 1층 GS25 편의점 앞에서 만나요!\n\n늦지 않게 도착해주세요 😊',
        is_important: true,
      },
    ];

    for (const ann of announcements) {
      await supabaseAdmin.from('course_announcements').upsert(ann);
    }

    console.log('✅ Announcements created');

    // 7. Create reviews
    console.log('Creating reviews...');
    const reviews = [
      {
        course_id: courses[0].id,
        user_id: users[0].id,
        rating: 5,
        content: '정말 최고의 여행이었습니다! 김여행님의 세심한 케어와 알찬 일정 덕분에 힐링하고 왔어요. 다음 여행도 꼭 참여하고 싶습니다!',
      },
    ];

    for (const review of reviews) {
      await supabaseAdmin.from('reviews').upsert(review);
    }

    console.log('✅ Reviews created');

    // 8. Create notifications
    console.log('Creating notifications...');
    const notifications = [
      {
        user_id: users[0].id,
        type: 'payment',
        title: '결제 완료',
        message: '제주도 힐링 여행 3박 4일 결제가 완료되었습니다.',
        data: { course_id: courses[0].id },
        is_read: true,
      },
      {
        user_id: users[0].id,
        type: 'announcement',
        title: '새 공지사항',
        message: '제주도 힐링 여행 코스에 새 공지사항이 등록되었습니다.',
        data: { course_id: courses[0].id },
        is_read: false,
      },
      {
        user_id: users[1].id,
        type: 'reminder',
        title: '결제 안내',
        message: '제주도 힐링 여행 참가비 결제를 완료해주세요.',
        data: { application_id: applications[1].id },
        is_read: false,
      },
    ];

    for (const notif of notifications) {
      await supabaseAdmin.from('notifications').upsert(notif);
    }

    console.log('✅ Notifications created');

    // 9. Create admin settings
    console.log('Creating admin settings...');
    await supabaseAdmin.from('admin_settings').upsert([
      {
        key: 'platform_fee_rate',
        value: '10',
        description: '플랫폼 수수료율 (%)',
      },
      {
        key: 'min_withdrawal_amount',
        value: '10000',
        description: '최소 출금 금액 (원)',
      },
      {
        key: 'refund_policy_days',
        value: '7',
        description: '전액 환불 가능 일수',
      },
    ]);

    console.log('✅ Admin settings created');

    console.log('\n🎉 Database seed completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('─────────────────────────────────────');
    console.log('Admin:       admin@test.com / Test1234!');
    console.log('Influencer1: influencer1@test.com / Test1234!');
    console.log('Influencer2: influencer2@test.com / Test1234!');
    console.log('User1:       user1@test.com / Test1234!');
    console.log('User2:       user2@test.com / Test1234!');
    console.log('User3:       user3@test.com / Test1234!');
    console.log('─────────────────────────────────────\n');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

// Run seed
seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
