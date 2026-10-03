<template>
    <div class="labMember-wrapper">
        <div class="title">Members</div>
        <div class="member-group-wrapper" v-for="(group, id) in member" :key="id">
            <div class="member-group-title">{{ group.title }}</div>
            <div class="member-group">
                <div class="member-wrapper" v-for="(member, id) in group.member" :key="id">
                    <img class="member-img" v-lazy src="" :data-src="member.imgUrl" alt="">
                    <div class="member-info-wrapper">
                        <div class="member-name">{{ member.name }}</div>
                        <div class="member-research-wrapper">
                            <div class="member-research-title">Research Topic</div>
                            <div class="member-research">{{ member.topic }}</div>
                        </div>
                        <div class="member-badge">{{ member.badge }}</div>
                        <div class="member-location">{{ member.location }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import member from '../../../config/Intorduction/Lab/member';
export default {
    name: 'Members',
    setup(){
        return {
            member
        }
    }
}
</script>

<style scoped>
    .labMember-wrapper{
        padding: 30px 30px 0 30px;
        box-sizing: border-box;
    }
    .title{
        font-size: 24px;
        font-weight: bolder;
        margin-bottom: 25px;
    }
    .content{
        margin-top: 15px;
        line-height: 1.65;
        text-align: justify;
    }
    .member-group-wrapper{
        margin-bottom: 30px;
    }
    .member-group-title{
        font-size: 20px;
        color: rgba(0,0,0,0.3);
    }
    .member-group{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;

        width: 100%;
        margin-top: 30px;
    }
    .member-wrapper{
        width: 100%;
        height: 205px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 15px;
        padding-right: 15px;
        box-sizing: border-box;
        position: relative;
        box-shadow: 0.5px 0.5px 5px gray;
        border-radius: 3px;
        transition: box-shadow 0.5s ease;
    }
    .member-wrapper:hover{
        cursor: pointer;
        box-shadow: 4px 4px 5px gray;
    }
    .member-img{
        width: 100px;
        height: 100px;
        border-radius: 100px;
    }
    .member-info-wrapper{
        width: calc(100% - 125px);
        height: 100px;
        box-sizing: border-box;
    }
    .member-name{
        font-size: 18px;
        font-weight: bolder;
    }
    .member-research-wrapper{
        margin-top: 15px;
        overflow: hidden;
    }
    .member-research-title{
        color: rgba(0,0,0,0.3);
        margin-bottom: 8px;
        font-size: 14px;
    }
    .member-research{
        line-height: 1.35;
        font-size: 12px;
        height: 50px;
        overflow-y: scroll;
        
    }
    .member-badge{
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 12px;
        color: rgba(0,0,0,0.3);
    }
    .member-location{
        position: absolute;
        bottom: 15px;
        right: 15px;
        font-size: 12px;
        color: rgba(0,0,0,0.3);
    }

    @media screen and (max-width: 1032px) {
        .member-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 30px;
            width: 100%;
            margin-top: 30px;
        }
    }
    @media screen and (max-width: 852px) {
        .member-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            width: 100%;
            margin-top: 30px;
        }
    }
</style>